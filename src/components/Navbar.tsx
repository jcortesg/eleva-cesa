import Image from 'next/image';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Image src="/logos/eleva-cesa.png" alt="Eleva Cesa Logo" width={150} height={50} />
          <Image src="/logos/cesa.png" alt="Cesa Logo" width={50} height={50} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
