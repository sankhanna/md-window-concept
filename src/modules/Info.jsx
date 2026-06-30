// Mock of the Film-Tools Info page (zillit_web/src/pages/FilmTools/info).
// Chat-style info board with PDF/.fdx attachments + an upload drop zone.
const POSTS = [
  { author: 'Vishal Kumar', role: '2nd assistant director', body: 'Latest shooting script uploaded. Page-locked version — please discard older PDFs.', file: 'Script_DN6_Final_v12.pdf', size: '6.71 MB', time: 'Nov 17, 2025 at 10:39 PM' },
  { author: 'Deepak UK Apple', role: 'Production accountant', body: 'Signed deal memo for the camera unit attached for records.', file: 'DealMemo_CamUnit.pdf', size: '165.97 KB', time: 'Jun 13, 2026 at 03:45 PM' },
]

export default function Info() {
  return (
    <div className="mod mod-info">
      <div className="mod-scroll">
        {POSTS.map((p, i) => (
          <div key={i} className="post">
            <div className="post__head">{p.author} <span className="post__role">({p.role})</span></div>
            <div className="post__body">{p.body}</div>
            <div className="info-file">
              <span className="info-file__icon">📄</span>
              <span className="info-file__name">{p.file}</span>
              <span className="info-file__size">{p.size}</span>
            </div>
            <div className="post__foot"><span className="post__time">{p.time}</span></div>
          </div>
        ))}
        <div className="dropzone">
          <div className="dropzone__title">Drop files here or click to upload</div>
          <div className="dropzone__hint">PDF or .fdx — max 70 MB per file</div>
        </div>
      </div>
      <div className="composer">
        <input className="composer__input" placeholder="Description (optional, max 500 chars)" />
        <button className="composer__send">Post</button>
      </div>
    </div>
  )
}
