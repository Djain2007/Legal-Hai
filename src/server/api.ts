import { Request, Response } from 'express';
import { supabase } from './supabase.js';
import { validateImageFile } from './parser.js';
import { runAnalysisPipeline } from './llm.js';

// ---------------------------------------------------------------------------
// Upload & Analyse
// ---------------------------------------------------------------------------
export async function handleUploadAndAnalyze(req: Request, res: Response) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded.' });

    const mimeType = validateImageFile(file.mimetype);

    // Resolve user_id from the request body or fall back to 'guest_user'
    const userId: string = (req.body?.user_id as string) || 'guest_user';

    let docId = 'temp_' + Date.now();
    let fileUrl = 'uploaded_via_memory';

    if (supabase) {
      const ext = mimeType.split('/')[1];
      const fileName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(fileName, file.buffer, { contentType: mimeType });

      if (!uploadError && uploadData) fileUrl = uploadData.path;

      const { data: docRecord } = await supabase
        .from('documents')
        .insert({ file_url: fileUrl, user_id: userId })
        .select()
        .single();

      if (docRecord) docId = docRecord.id;
    }

    const analysisResult = await runAnalysisPipeline(file.buffer, mimeType);

    if (supabase && docId && !docId.startsWith('temp_')) {
      await supabase.from('analysis').insert({
        document_id: docId,
        risk_score: analysisResult.risk_score,
        result_json: analysisResult,
      });
    }

    return res.status(200).json({ document_id: docId, analysis: analysisResult });
  } catch (error: any) {
    console.error('[api] Error:', error?.message || error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

// ---------------------------------------------------------------------------
// History — list all analyses for a given user_id
// ---------------------------------------------------------------------------
export async function getHistory(req: Request, res: Response) {
  try {
    if (!supabase) return res.status(400).json({ error: 'Supabase not configured.' });

    const userId = (req.query.user_id as string) || 'guest_user';

    const { data, error } = await supabase
      .from('analysis')
      .select('*, documents!inner(file_url, created_at, user_id)')
      .eq('documents.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json(data ?? []);
  } catch (error: any) {
    console.error('[api] History error:', error?.message || error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

// ---------------------------------------------------------------------------
// Settings — GET and POST (upsert) user settings
// ---------------------------------------------------------------------------
export async function getSettings(req: Request, res: Response) {
  try {
    if (!supabase) return res.status(400).json({ error: 'Supabase not configured.' });

    const userId = req.query.user_id as string;
    if (!userId) return res.status(400).json({ error: 'user_id is required.' });

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no row found

    // Return defaults if no row exists yet
    return res.status(200).json(data ?? {
      user_id: userId,
      display_name: '',
      email_notifications: false,
      default_risk_threshold: 50,
    });
  } catch (error: any) {
    console.error('[api] getSettings error:', error?.message || error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

export async function upsertSettings(req: Request, res: Response) {
  try {
    if (!supabase) return res.status(400).json({ error: 'Supabase not configured.' });

    const { user_id, display_name, email_notifications, default_risk_threshold } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id is required.' });

    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id,
        display_name: display_name ?? '',
        email_notifications: email_notifications ?? false,
        default_risk_threshold: default_risk_threshold ?? 50,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('[api] upsertSettings error:', error?.message || error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
