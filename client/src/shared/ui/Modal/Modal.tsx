import { ErrorAuth } from "./ModalContent/ErrorAuth";

enum modalType {
  authError = "auth-error",
  authSucces = "auth-succes",
}
interface ModalProp {
  data: {
    type: modalType;
    title: string;
    text: string;
  };
}

export const Modal = ({ data }: ModalProp) => {
  function getModalByType(type: modalType) {
    switch (type) {
      case modalType.authError:
        return <ErrorAuth text={data.text} />;
      default:
        return <></>;
    }
  }

  return (
    <div className="modal">
      <h1 className="modal__title">{data.title}</h1>
      <div className="modal__body">{getModalByType(data.type)}</div>
    </div>
  );
};
