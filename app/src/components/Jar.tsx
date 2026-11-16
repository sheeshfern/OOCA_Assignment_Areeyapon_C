// a glass jar with a lid; the fill colour comes from --c on the parent
export function Jar() {
  return (
    <svg className="jar-svg" viewBox="0 0 48 60" aria-hidden="true">
      <rect x="12" y="2" width="24" height="7" rx="2.5" className="lid" />
      <path d="M10 12h28q4 0 4 6v32q0 8-8 8H14q-8 0-8-8V18q0-6 4-6z" className="glass" />
      <path d="M8 30q8-3 16 0t16 0v20q0 6-6 6H14q-6 0-6-6z" className="fill" />
      <path d="M12 18v24" className="shine" />
    </svg>
  );
}
