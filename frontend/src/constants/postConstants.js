export const SUBJECT_LABELS = {
  matematica: "Matemática",
  historia: "História",
  geografia: "Geografia",
  portugues: "Português",
  filosofia: "Filosofia",
  ciencias: "Ciências",
};

export const CONTENT_TYPE_LABELS = {
  aula_teorica: "Aula",
  material_complementar: "Material Complementar",
  tarefa: "Tarefa",
  aviso: "Aviso",
};

export const STATUS_LABELS = {
  publicado: "Publicado",
  rascunho: "Rascunho",
  arquivado: "Arquivado",
};

export const formatSubject = (subject) => {
  return SUBJECT_LABELS[subject] || subject || "";
};

export const formatContentType = (contentType) => {
  return CONTENT_TYPE_LABELS[contentType] || contentType || "";
};

export const formatStatus = (status) => {
  return STATUS_LABELS[status] || status || "";
};
