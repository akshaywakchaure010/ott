import "../../styles/loader.css";

const Loader = ({ fullScreen = false }) => {
  return (
    <div className={`pp-loader-wrap${fullScreen ? " fullscreen" : ""}`}>
      <div className="pp-loader-mark">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default Loader;
