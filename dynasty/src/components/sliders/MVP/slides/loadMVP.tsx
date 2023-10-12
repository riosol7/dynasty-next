import styles from "../MVP.module.css";

export default function loadMVP() {
    return (
        <div className={`w-12/12 ${styles.mvpLayout}`} style={{ height: "155px", backgroundColor:"#111111" }}></div>
    );
};