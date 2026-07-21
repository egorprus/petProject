import styles from "./style.module.scss";
import github from "../../assets/icons/github.svg";
import linkedin from "../../assets/icons/linkedin.svg";
import mail from "../../assets/icons/mail.svg";

const SOCIALS_LIST = [
  {
    name: "githab",
    link: "https://github.com/egorprus",
    icon: github,
  },
  {
    name: "linkedin",
    link: "https://www.linkedin.com/in/egor-prus-nik/",
    icon: linkedin,
  },
  {
    name: "email",
    link: "prus.egor.nik@gmail.com",
    icon: mail,
  },
];

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <span className={styles.footerBrandBadge}>EP</span>
          <span className={styles.footerCopy}>© {new Date().getFullYear()} Egor Prus</span>
        </div>
        <ul className="socials">
          {SOCIALS_LIST.map((item, index) => (
            <li key={index}>
              <a className="socials__link" href={item.link} target="_blank" rel="noreferrer">
                <img
                  className="socials__icon"
                  src={item.icon}
                  alt={`link to ${item.name}`}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};
