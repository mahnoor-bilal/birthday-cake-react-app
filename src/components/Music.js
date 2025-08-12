import './Music.css';

function Music() {
  return (
    <>
    <div className="vinyl">
      <img src="/vinylrecord.png" alt="vinyl" className="vinyl-img" />
      <audio src="/happy-birthday-322777.mp3" autoPlay loop />
      </div>
    </>
  );
}
export default Music;