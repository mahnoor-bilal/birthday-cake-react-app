import './Cake.css';

function Cake({ isLit }) {
  return (
    <div className="cake-lit">
      <img
        src={isLit ? "/cake-lit.png" : "/cake-unlit.png"}
        alt="Birthday Cake"
        className="cake-img"
      />
    </div>
  );
}

export default Cake;
