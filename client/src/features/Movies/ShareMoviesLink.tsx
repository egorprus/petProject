import { Modal } from "@features/Modal/Modal";
import { useModal } from "@features/Modal/useModal";
import { ButtonTypes } from "@shared/types/enums";
import { DefaultButton } from "@shared/ui/Buttons/DefaultButtons/DefaultButtons";
import { moviesApi } from "@features/Movies/api";
import { useState } from "react";
import { FaShareAlt } from "react-icons/fa";
import styles from "./style.module.scss";

export const ShareMoviesLink = () => {
  const modal = useModal();
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = shareToken ? `${window.location.origin}/movies/shared/${shareToken}` : "";

  const handleOpen = async () => {
    modal.open();
    setIsLoading(true);
    const { shareToken: token } = await moviesApi.getShareLink();
    setShareToken(token);
    setIsLoading(false);
  };

  const handleRegenerate = async () => {
    setIsLoading(true);
    setCopied(false);
    const { shareToken: token } = await moviesApi.regenerateShareLink();
    setShareToken(token);
    setIsLoading(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };

  return (
    <>
      <button className={styles.iconButton} onClick={handleOpen} title="Поделиться">
        <FaShareAlt size={18} />
      </button>

      <Modal isOpen={modal.isOpen} onClose={modal.close}>
        <div className={styles.form}>
          <p>Ссылка на просмотр каталога фильмов (без возможности редактирования):</p>
          {isLoading || !shareUrl ? (
            <p>Загрузка...</p>
          ) : (
            <>
              <input
                className={styles.shareInput}
                readOnly
                value={shareUrl}
                onFocus={(e) => e.target.select()}
              />
              <div className={styles.shareActions}>
                <DefaultButton
                  type={ButtonTypes.button}
                  label={copied ? "Скопировано" : "Копировать"}
                  handleClick={handleCopy}
                />
                <DefaultButton
                  type={ButtonTypes.button}
                  label="Обновить ссылку"
                  handleClick={handleRegenerate}
                />
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};
