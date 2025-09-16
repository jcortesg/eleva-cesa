import Image from 'next/image';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Image src="/logos/cesa.png" alt="Cesa Logo" width={39} height={44} />
          <Image src="/logos/eleva-cesa.png" alt="Eleva Cesa Logo" width={100} height={67} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
