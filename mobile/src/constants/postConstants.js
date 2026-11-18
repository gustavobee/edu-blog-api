export const SUBJECTS = [
  { value: 'matematica', label: 'Matemática', color: '#4F46E5', icon: 'calculator' },
  { value: 'ciencias', label: 'Ciências', color: '#059669', icon: 'flask' },
  { value: 'filosofia', label: 'Filosofia', color: '#7C3AED', icon: 'book' },
  { value: 'geografia', label: 'Geografia', color: '#D97706', icon: 'globe' },
  { value: 'portugues', label: 'Português', color: '#DB2777', icon: 'create' },
  { value: 'historia', label: 'História', color: '#DC2626', icon: 'hourglass' },
];

export const CONTENT_TYPES = [
  { value: 'aula_teorica', label: 'Aula Teórica', icon: 'easel-outline' },
  { value: 'tarefa', label: 'Tarefa', icon: 'clipboard-outline' },
  { value: 'material_complementar', label: 'Material Complementar', icon: 'folder-open-outline' },
  { value: 'aviso', label: 'Aviso', icon: 'megaphone-outline' },
];

export const STATUSES = [
  { value: 'publicado', label: 'Publicado', color: '#10B981', bgColor: '#ECFDF5' },
  { value: 'rascunho', label: 'Rascunho', color: '#F59E0B', bgColor: '#FFFBEB' },
  { value: 'arquivado', label: 'Arquivado', color: '#64748B', bgColor: '#F1F5F9' },
];

export const getSubjectInfo = (val) => {
  return SUBJECTS.find((s) => s.value === val) || {
    value: val || 'geral',
    label: (val ? val.charAt(0).toUpperCase() + val.slice(1) : 'Geral'),
    color: '#4F46E5',
    icon: 'book',
  };
};

export const getContentTypeInfo = (val) => {
  return CONTENT_TYPES.find((c) => c.value === val) || {
    value: val || 'conteudo',
    label: (val ? val.replace('_', ' ') : 'Conteúdo'),
    icon: 'document-text-outline',
  };
};

export const getStatusInfo = (val) => {
  return STATUSES.find((s) => s.value === val) || {
    value: val || 'publicado',
    label: (val ? val.charAt(0).toUpperCase() + val.slice(1) : 'Publicado'),
    color: '#10B981',
    bgColor: '#ECFDF5',
  };
};
