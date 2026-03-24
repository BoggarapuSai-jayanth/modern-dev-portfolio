import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";

// --- Custom Hook for File Upload ---
export const useFileUploadHook = () => {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getUrl = useMutation(api.files.getUrl);
  const handleFileUpload = async (file) => {
    if (!file) return undefined;
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      const { storageId } = await result.json();
      return await getUrl({ storageId });
    } catch (e) {
      console.error("File upload failed:", e);
      alert("Failed to upload file.");
      throw e;
    }
  };
  return handleFileUpload;
};

// --- Input helpers ---
const inp = "w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 focus:border-primary focus:outline-none transition text-white placeholder-gray-500";
const fileInp = "w-full text-sm file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-white/10 file:text-white";

// --- AdminSection with Edit support ---
const AdminSection = ({ title, data, onRemove, onUpdate, renderForm, renderEditForm, renderItem }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  if (data === undefined) return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
      <h2 className="text-2xl font-bold mb-6 text-gray-500">Loading {title}...</h2>
    </div>
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); }} className="bg-primary px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition shadow-lg">
          {showForm ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-black/40 rounded-xl border border-white/5">
          {renderForm(() => setShowForm(false))}
        </div>
      )}

      <div className="space-y-4">
        {data.length === 0 ? <p className="text-gray-500">No items found.</p> : null}
        {data.map((item) => (
          <div key={item._id}>
            <div className="flex justify-between items-start p-4 bg-black/20 rounded-xl border border-white/5 group hover:bg-black/40 transition">
              <div className="flex-1 pr-4">{renderItem(item)}</div>
              <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => { setEditingId(editingId === item._id ? null : item._id); setShowForm(false); }}
                  className="text-primary hover:bg-primary/10 px-3 py-1 text-sm font-medium rounded transition border border-primary/20"
                >
                  {editingId === item._id ? 'Cancel' : 'Edit'}
                </button>
                <button
                  onClick={() => onRemove({ id: item._id })}
                  className="text-red-500 hover:bg-red-500/10 px-3 py-1 text-sm font-medium rounded transition border border-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
            {editingId === item._id && (
              <div className="mt-2 p-6 bg-black/40 rounded-xl border border-primary/20">
                <p className="text-xs text-primary font-semibold mb-4 uppercase tracking-widest">Editing Item</p>
                {renderEditForm(item, () => setEditingId(null), onUpdate)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- AboutForm ---
const AboutForm = ({ data, onSave, onFileUpload }) => {
  const [formData, setFormData] = useState({ text: data?.text || '' });
  const [imageFile, setImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.text && !formData.text) setFormData({ text: data.text });
  }, [data?.text]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setSaved(false);
    try {
      const uploads = await Promise.all([
        imageFile ? onFileUpload(imageFile) : Promise.resolve(data?.imageUrl),
        resumeFile ? onFileUpload(resumeFile) : Promise.resolve(data?.resumeUrl),
      ]);
      await onSave({ ...formData, imageUrl: uploads[0], resumeUrl: uploads[1] });
      setImageFile(null); setResumeFile(null); setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { alert('Save failed: ' + err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6">About Me</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Upload Profile Image</label>
          {data?.imageUrl && !imageFile && <div className="mb-2 text-xs text-primary">Current image active. Uploading a new one overrides it.</div>}
          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className={`${inp} file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90`} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Upload CV/Resume (PDF)</label>
          {data?.resumeUrl && !resumeFile && <a href={data.resumeUrl} target="_blank" rel="noreferrer" className="mb-2 text-xs text-primary inline-block hover:underline">📄 View Current Assigned Resume</a>}
          <input type="file" accept="application/pdf" onChange={e => setResumeFile(e.target.files[0])} className={`${inp} file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90`} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Biography</label>
          <textarea rows="6" placeholder="Your bio..." required className={inp} value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} />
        </div>
        <button type="submit" disabled={saving} className="bg-primary px-6 py-2 rounded-lg font-medium hover:bg-primary/90 w-full text-white disabled:opacity-50 transition flex items-center justify-center gap-2">
          {saving ? <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Uploading & Saving...</> : saved ? <>✅ Saved!</> : <>Update About Me</>}
        </button>
      </form>
    </div>
  );
};

// --- ProjectForm (Add + Edit) ---
const ProjectForm = ({ onSave, onCancel, onFileUpload, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    liveUrl: initialData?.liveUrl || '',
    githubUrl: initialData?.githubUrl || '',
    techStack: Array.isArray(initialData?.techStack) ? initialData.techStack.join(', ') : '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const uploads = await Promise.all([
        imageFile ? onFileUpload(imageFile) : Promise.resolve(initialData?.imageUrl),
        pdfFile ? onFileUpload(pdfFile) : Promise.resolve(initialData?.pdfUrl),
      ]);
      await onSave({ ...formData, imageUrl: uploads[0], pdfUrl: uploads[1], techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean) });
      onCancel();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="text" placeholder="Title" required className={inp} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
      <textarea placeholder="Description" required className={inp} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
      <div>
        <label className="text-sm text-gray-400 block mb-1">Project Image {initialData?.imageUrl && <span className="text-primary">(has image)</span>}</label>
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className={fileInp} />
      </div>
      <div>
        <label className="text-sm text-gray-400 block mb-1">Project PDF (Optional)</label>
        <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} className={fileInp} />
      </div>
      <input type="text" placeholder="Live URL" className={inp} value={formData.liveUrl} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })} />
      <input type="text" placeholder="GitHub URL" className={inp} value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} />
      <input type="text" placeholder="Tech Stack (comma separated)" className={inp} value={formData.techStack} onChange={e => setFormData({ ...formData, techStack: e.target.value })} />
      <button type="submit" disabled={saving} className="bg-primary px-6 py-2 rounded-lg font-medium hover:bg-primary/90 w-full text-white disabled:opacity-50">
        {saving ? 'Uploading...' : initialData ? 'Update Project' : 'Save Project'}
      </button>
    </form>
  );
};

// --- SkillForm (Add + Edit) ---
const SkillForm = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({ name: initialData?.name || '', category: initialData?.category || '', level: initialData?.level ?? 50 });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    await onSave({ ...formData, level: Number(formData.level) });
    setSaving(false); onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="text" placeholder="Skill Name" required className={inp} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
      <input type="text" placeholder="Category (e.g. Frontend)" required className={inp} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
      <input type="number" placeholder="Level (0-100)" required min="0" max="100" className={inp} value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} />
      <button type="submit" disabled={saving} className="bg-primary px-6 py-2 rounded-lg w-full text-white disabled:opacity-50">
        {saving ? 'Saving...' : initialData ? 'Update Skill' : 'Save Skill'}
      </button>
    </form>
  );
};

// --- GenericEduForm (Add + Edit) for training/internship/education ---
const GenericEduForm = ({ onSave, onCancel, type, onFileUpload, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || initialData?.degree || initialData?.role || '',
    provider: initialData?.provider || initialData?.institution || initialData?.company || '',
    duration: initialData?.duration || '',
    description: initialData?.description || '',
    score: initialData?.score || '',
    order: initialData?.order ?? 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const uploads = await Promise.all([
        imageFile && onFileUpload ? onFileUpload(imageFile) : Promise.resolve(initialData?.imageUrl),
        pdfFile && onFileUpload ? onFileUpload(pdfFile) : Promise.resolve(initialData?.pdfUrl),
      ]);
      const base = { ...formData };
      delete base.score;
      const data = type === 'edu'
        ? { ...base, score: formData.score, imageUrl: uploads[0], pdfUrl: uploads[1], order: Number(formData.order) }
        : { ...base, imageUrl: uploads[0], pdfUrl: uploads[1], order: Number(formData.order) };
      await onSave(data);
      onCancel();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="text" placeholder={type === 'edu' ? 'Degree' : type === 'intern' ? 'Role' : 'Title'} required className={inp} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
      <input type="text" placeholder={type === 'edu' ? 'Institution' : type === 'intern' ? 'Company' : 'Provider'} required className={inp} value={formData.provider} onChange={e => setFormData({ ...formData, provider: e.target.value })} />
      <input type="text" placeholder="Duration" required className={inp} value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
      {type === 'edu' ? (
        <input type="text" placeholder="Score (e.g., 95% or 8.5 CGPA)" className={inp} value={formData.score} onChange={e => setFormData({ ...formData, score: e.target.value })} />
      ) : (
        <textarea placeholder="Description" required className={inp} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
      )}
      {(type === 'training' || type === 'intern') && (
        <>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Image {initialData?.imageUrl && <span className="text-primary">(has image)</span>}</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className={fileInp} />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">PDF Certificate {initialData?.pdfUrl && <span className="text-primary">(has PDF)</span>}</label>
            <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} className={fileInp} />
          </div>
        </>
      )}
      <input type="number" placeholder="Sort Order" className={inp} value={formData.order} onChange={e => setFormData({ ...formData, order: e.target.value })} />
      <button type="submit" disabled={saving} className="bg-primary px-6 py-2 rounded-lg w-full text-white disabled:opacity-50">
        {saving ? 'Uploading...' : initialData ? 'Update Item' : 'Save Item'}
      </button>
    </form>
  );
};

// --- CertificatesForm (Add + Edit) ---
const CertificatesForm = ({ onSave, onCancel, onFileUpload, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    issuer: initialData?.issuer || '',
    date: initialData?.date || '',
    link: initialData?.link || '',
    order: initialData?.order ?? 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const uploads = await Promise.all([
        imageFile ? onFileUpload(imageFile) : Promise.resolve(initialData?.imageUrl),
        pdfFile ? onFileUpload(pdfFile) : Promise.resolve(initialData?.pdfUrl),
      ]);
      await onSave({ ...formData, imageUrl: uploads[0], pdfUrl: uploads[1], order: Number(formData.order) });
      onCancel();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="text" placeholder="Title" required className={inp} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
      <input type="text" placeholder="Issuer" required className={inp} value={formData.issuer} onChange={e => setFormData({ ...formData, issuer: e.target.value })} />
      <input type="text" placeholder="Date" required className={inp} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
      <input type="text" placeholder="External Verification Link" className={inp} value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
      <div>
        <label className="text-sm text-gray-400 block mb-1">Badge Image {initialData?.imageUrl && <span className="text-primary">(has image)</span>}</label>
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className={fileInp} />
      </div>
      <div>
        <label className="text-sm text-gray-400 block mb-1">Upload PDF</label>
        <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} className={fileInp} />
      </div>
      <button type="submit" disabled={saving} className="bg-primary px-6 py-2 rounded-lg w-full text-white disabled:opacity-50">
        {saving ? 'Uploading...' : initialData ? 'Update Certificate' : 'Save Certificate'}
      </button>
    </form>
  );
};

// --- Tab Components ---
const AboutTab = () => {
  const data = useQuery(api.about.get);
  const save = useMutation(api.about.save);
  const upload = useFileUploadHook();
  if (data === undefined) return <p className="text-gray-400">Loading data...</p>;
  return <AboutForm data={data} onSave={save} onFileUpload={upload} />;
};

const ProjectsTab = () => {
  const data = useQuery(api.projects.get);
  const add = useMutation(api.projects.add);
  const remove = useMutation(api.projects.remove);
  const update = useMutation(api.projects.update);
  const upload = useFileUploadHook();

  return (
    <AdminSection
      title="Projects" data={data} onRemove={remove} onUpdate={update}
      renderForm={(cancel) => <ProjectForm onSave={add} onCancel={cancel} onFileUpload={upload} />}
      renderEditForm={(item, cancel, onUpdate) => (
        <ProjectForm
          initialData={item} onCancel={cancel} onFileUpload={upload}
          onSave={(d) => onUpdate({ id: item._id, ...d })}
        />
      )}
      renderItem={(item) => (
        <div>
          <strong className="text-lg flex items-center gap-2">{item.title} {item.imageUrl && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">🖼️ Has Image</span>}</strong>
          <p className="text-sm text-gray-400 mb-1">{item.description}</p>
          {item.pdfUrl && <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs">📄 View PDF</a>}
        </div>
      )}
    />
  );
};

const SkillsTab = () => {
  const data = useQuery(api.skills.get);
  const add = useMutation(api.skills.add);
  const remove = useMutation(api.skills.remove);
  const update = useMutation(api.skills.update);

  return (
    <AdminSection
      title="Skills" data={data} onRemove={remove} onUpdate={update}
      renderForm={(cancel) => <SkillForm onSave={add} onCancel={cancel} />}
      renderEditForm={(item, cancel, onUpdate) => (
        <SkillForm initialData={item} onCancel={cancel} onSave={(d) => onUpdate({ id: item._id, ...d })} />
      )}
      renderItem={(item) => (
        <div>
          <strong className="text-lg">{item.name}</strong>
          <span className="ml-2 text-xs bg-white/10 px-2 py-1 rounded">{item.category}</span>
          <p className="text-sm text-gray-400">Level: {item.level}%</p>
        </div>
      )}
    />
  );
};

const TrainingTab = () => {
  const data = useQuery(api.training.get);
  const add = useMutation(api.training.add);
  const remove = useMutation(api.training.remove);
  const update = useMutation(api.training.update);
  const upload = useFileUploadHook();

  return (
    <AdminSection
      title="Training" data={data} onRemove={remove} onUpdate={update}
      renderForm={(cancel) => <GenericEduForm onSave={add} onCancel={cancel} type="training" onFileUpload={upload} />}
      renderEditForm={(item, cancel, onUpdate) => (
        <GenericEduForm
          initialData={item} onCancel={cancel} type="training" onFileUpload={upload}
          onSave={(d) => onUpdate({ id: item._id, title: d.title, provider: d.provider, duration: d.duration, description: d.description, imageUrl: d.imageUrl, pdfUrl: d.pdfUrl, order: d.order })}
        />
      )}
      renderItem={(item) => (
        <div>
          <strong className="text-lg flex items-center gap-2">{item.title}{item.imageUrl && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">🖼️ Has Image</span>}</strong>
          <p className="text-sm text-primary mb-1">{item.provider} ({item.duration})</p>
          <p className="text-sm text-gray-400 mb-1">{item.description}</p>
          {item.pdfUrl && <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs">📄 View PDF</a>}
        </div>
      )}
    />
  );
};

const InternshipsTab = () => {
  const data = useQuery(api.internships.get);
  const add = useMutation(api.internships.add);
  const remove = useMutation(api.internships.remove);
  const update = useMutation(api.internships.update);
  const upload = useFileUploadHook();

  return (
    <AdminSection
      title="Internships" data={data} onRemove={remove} onUpdate={update}
      renderForm={(cancel) => (
        <GenericEduForm
          onSave={(d) => add({ role: d.title, company: d.provider, duration: d.duration, description: d.description, imageUrl: d.imageUrl, pdfUrl: d.pdfUrl, order: d.order })}
          onCancel={cancel} type="intern" onFileUpload={upload}
        />
      )}
      renderEditForm={(item, cancel, onUpdate) => (
        <GenericEduForm
          initialData={item} onCancel={cancel} type="intern" onFileUpload={upload}
          onSave={(d) => onUpdate({ id: item._id, role: d.title, company: d.provider, duration: d.duration, description: d.description, imageUrl: d.imageUrl, pdfUrl: d.pdfUrl, order: d.order })}
        />
      )}
      renderItem={(item) => (
        <div>
          <strong className="text-lg flex items-center gap-2">{item.role} at {item.company}{item.imageUrl && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">🖼️ Has Image</span>}</strong>
          <p className="text-sm text-primary mb-1">{item.duration}</p>
          <p className="text-sm text-gray-400 mb-1">{item.description}</p>
          {item.pdfUrl && <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs">📄 View PDF</a>}
        </div>
      )}
    />
  );
};

const CertificatesTab = () => {
  const data = useQuery(api.certificates.get);
  const add = useMutation(api.certificates.add);
  const remove = useMutation(api.certificates.remove);
  const update = useMutation(api.certificates.update);
  const upload = useFileUploadHook();

  return (
    <AdminSection
      title="Certificates" data={data} onRemove={remove} onUpdate={update}
      renderForm={(cancel) => <CertificatesForm onSave={add} onCancel={cancel} onFileUpload={upload} />}
      renderEditForm={(item, cancel, onUpdate) => (
        <CertificatesForm initialData={item} onCancel={cancel} onFileUpload={upload} onSave={(d) => onUpdate({ id: item._id, ...d })} />
      )}
      renderItem={(item) => (
        <div>
          <strong className="text-lg flex items-center gap-2">{item.title}{item.imageUrl && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">🖼️ Has Image</span>}</strong>
          <p className="text-sm text-gray-400 mb-1">{item.issuer} - {item.date}</p>
          {item.pdfUrl && <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs">📄 View PDF</a>}
        </div>
      )}
    />
  );
};

const EducationTab = () => {
  const data = useQuery(api.education.get);
  const add = useMutation(api.education.add);
  const remove = useMutation(api.education.remove);
  const update = useMutation(api.education.update);

  return (
    <AdminSection
      title="Education" data={data} onRemove={remove} onUpdate={update}
      renderForm={(cancel) => (
        <GenericEduForm
          onSave={(d) => add({ degree: d.title, institution: d.provider, duration: d.duration, score: d.score, order: d.order })}
          onCancel={cancel} type="edu"
        />
      )}
      renderEditForm={(item, cancel, onUpdate) => (
        <GenericEduForm
          initialData={item} onCancel={cancel} type="edu"
          onSave={(d) => onUpdate({ id: item._id, degree: d.title, institution: d.provider, duration: d.duration, score: d.score, order: d.order })}
        />
      )}
      renderItem={(item) => (
        <div>
          <strong className="text-lg">{item.degree}</strong>
          <p className="text-sm text-primary mb-1">{item.institution} ({item.duration})</p>
          <p className="text-sm font-bold text-secondary mt-2">{item.score ? `Score: ${item.score}` : item.description}</p>
        </div>
      )}
    />
  );
};

const MessagesTab = () => {
  const messages = useQuery(api.messages.get);
  const removeMessage = useMutation(api.messages.remove);

  if (messages === undefined) return <p className="text-gray-400">Loading messages...</p>;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Messages</h2>
      <div className="space-y-4">
        {messages.length === 0 ? <p className="text-gray-500">No messages yet.</p> : null}
        {messages.map((msg) => (
          <div key={msg._id} className="p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h4 className="font-bold text-lg">{msg.name} <span className="text-sm font-normal text-gray-400 ml-2">&lt;{msg.email}&gt;</span></h4>
              <p className="text-sm text-secondary mb-3">{new Date(msg.createdAt).toLocaleString()}</p>
              <p className="text-gray-200">{msg.message}</p>
            </div>
            <button onClick={() => removeMessage({ id: msg._id })} className="text-red-500 hover:bg-red-500/10 px-4 py-2 self-start text-sm font-medium rounded-lg h-fit border border-red-500/20 transition">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- App Layout ---
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
  }, [navigate]);

  const tabs = [
    { id: 'about', label: 'About Me' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'training', label: 'Training' },
    { id: 'internships', label: 'Internships' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'education', label: 'Education' },
    { id: 'messages', label: 'Messages' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-white">
      <aside className="w-full md:w-64 border-r border-white/10 bg-black/50 p-6 flex flex-col shadow-2xl z-10">
        <h2 className="text-xl font-bold mb-6 text-primary tracking-wide">Admin Panel</h2>
        <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 mb-8 bg-white/5 hover:bg-primary/20 text-white font-medium py-3 rounded-xl transition-all border border-white/10 group shadow-md">
          <span className="group-hover:scale-110 transition-transform">👁️</span>
          <span>View Live Page</span>
        </button>
        <nav className="flex flex-row overflow-x-auto md:flex-col flex-1 gap-2 md:gap-3 mb-6 pb-2 md:pb-0">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-3 rounded-xl text-left transition-all font-medium ${activeTab === tab.id ? 'bg-gradient-to-r from-primary/80 to-secondary/80 text-white shadow-lg border border-white/20' : 'hover:bg-white/10 text-gray-400 hover:text-white border border-transparent'}`}>
              {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={() => { localStorage.removeItem('isAuthenticated'); navigate('/'); }} className="mt-auto px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-red-500/20 font-bold">
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-black/80 to-black/40 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Dashboard Overview</h1>
        <div className="max-w-4xl transition-all duration-300">
          {activeTab === 'about' && <AboutTab />}
          {activeTab === 'projects' && <ProjectsTab />}
          {activeTab === 'skills' && <SkillsTab />}
          {activeTab === 'training' && <TrainingTab />}
          {activeTab === 'internships' && <InternshipsTab />}
          {activeTab === 'certificates' && <CertificatesTab />}
          {activeTab === 'education' && <EducationTab />}
          {activeTab === 'messages' && <MessagesTab />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
