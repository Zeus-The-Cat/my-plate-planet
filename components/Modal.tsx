import styles from "../styles/Home.module.css";

export const Modal = (props: any) => {
  const ShowModal = () => {
    const closeModal = () => {
      props.setModal(false);
    };
    const visible = () => {
      return { opacity: props.modal ? 1 : 0 };
    };
    return (
      <div className={styles.modal} style={visible()}>
        <button onClick={closeModal} className={styles.closeModal}>
          {" "}
          X{" "}
        </button>
        <div className={styles.modalContent} style={visible()}>
          {props.children}
        </div>
      </div>
    );
  };
  return <>{props.modal && <ShowModal />}</>;
};
