import './Relight.css';

function Relight({ onRelight }) {
  return (
    <div className="lighter" onClick={onRelight}>
      <img src="/lighter.png" alt="lighter" className="lighter-img" />
    </div>
  );
}

export default Relight;
