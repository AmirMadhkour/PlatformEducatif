import { useEffect, useState } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import matiereService from '../../services/matiereService';
import { LoadingState, ErrorState, EmptyState, ConfirmDialog } from '../../components/common/SharedWidgets';
import { COLORS } from '../../theme/theme';

export default function AdminMatieresPage() {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dialogState, setDialogState] = useState(null); // { mode: 'create'|'edit', matiere }
  const [form, setForm] = useState({ nom: '', description: '' });
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const charger = () => {
    matiereService.getAll().then(setMatieres).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, []);

  const ouvrirCreation = () => { setForm({ nom: '', description: '' }); setDialogState({ mode: 'create' }); };
  const ouvrirEdition = (m) => { setForm({ nom: m.nom, description: m.description || '' }); setDialogState({ mode: 'edit', id: m.id }); };

  const handleSave = async () => {
    setSaving(true);
    setFormError(null);
    try {
      if (dialogState.mode === 'create') await matiereService.create(form);
      else await matiereService.update(dialogState.id, form);
      setDialogState(null);
      charger();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Une matière avec ce nom existe peut-être déjà.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await matiereService.delete(toDelete.id);
      setToDelete(null);
      charger();
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Suppression impossible : cette matière est encore utilisée.');
      setToDelete(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 24, color: COLORS.footerBackground }}>Matières</Typography>
        <Button onClick={ouvrirCreation} variant="contained" startIcon={<AddIcon />} sx={{ backgroundColor: COLORS.primary }}>Ajouter une matière</Button>
      </Box>

      {deleteError && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setDeleteError(null)}>{deleteError}</Alert>}

      {loading && <LoadingState />}
      {error && <ErrorState />}

      {!loading && !error && (
        <Paper elevation={0} sx={{ border: '1px solid #F1F5F9', borderRadius: '16px', p: 3 }}>
          {matieres.length === 0 ? (
            <EmptyState message="Aucune matière configurée." />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>NOM</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>DESCRIPTION</TableCell>
                  <TableCell align="right" sx={{ fontFamily: 'Inter', fontWeight: 700, color: '#94A3B8', fontSize: 12 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matieres.map((m) => (
                  <TableRow key={m.id} sx={{ '& td': { fontFamily: 'Inter' } }}>
                    <TableCell sx={{ fontWeight: 600, color: COLORS.footerBackground }}>{m.nom}</TableCell>
                    <TableCell>{m.description || '—'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => ouvrirEdition(m)}><EditOutlinedIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => setToDelete(m)}><DeleteOutlineIcon fontSize="small" sx={{ color: '#EF4444' }} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}

      <Dialog open={!!dialogState} onClose={() => setDialogState(null)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontFamily: 'Inter', fontWeight: 700 }}>{dialogState?.mode === 'create' ? 'Ajouter une matière' : 'Modifier la matière'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{formError}</Alert>}
          <TextField fullWidth label="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} sx={{ mb: 2, mt: 1 }} />
          <TextField fullWidth multiline rows={2} label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setDialogState(null)} sx={{ color: '#64748B' }}>Annuler</Button>
          <Button variant="contained" disabled={!form.nom || saving} onClick={handleSave} sx={{ backgroundColor: COLORS.primary }}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer cette matière ?"
        description="Impossible si elle est encore utilisée par des cours ou des affectations."
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
      />
    </Box>
  );
}
