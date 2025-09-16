'use client';

import React from 'react';
import '../app/styles/TermsModal.css';

interface TermsModalProps {
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h1>Términos y Condiciones</h1>
        <p>Última actualización: 24 de julio de 2024</p>

        <h2>1. Aceptación de los Términos</h2>
        <p>
          Al acceder y utilizar nuestro sitio web, usted acepta estar sujeto a estos Términos y Condiciones y a nuestra Política de Privacidad. Si no está de acuerdo con alguno de estos términos, tiene prohibido utilizar o acceder a este sitio.
        </p>

        <h2>2. Donaciones</h2>
        <p>
          Todas las donaciones realizadas a través de nuestro sitio web son voluntarias y no reembolsables. Nos asociamos con procesadores de pago de terceros para gestionar de forma segura las transacciones. No almacenamos la información de su tarjeta de crédito.
        </p>

        <h2>3. Uso del Sitio Web</h2>
        <p>
          Se le concede un permiso limitado para acceder y hacer uso personal de este sitio. Este permiso no incluye ningún derecho a:
        </p>
        <ul>
          <li>Revender o hacer uso comercial del sitio o su contenido.</li>
          <li>Realizar un uso derivado de este sitio o su contenido.</li>
          <li>Descargar o copiar información de la cuenta en beneficio de otro comerciante.</li>
        </ul>

        <h2>4. Propiedad Intelectual</h2>
        <p>
          El contenido, la organización, los gráficos, el diseño, la compilación y otros asuntos relacionados con el sitio están protegidos por las leyes de derechos de autor y marcas registradas. La copia, redistribución, uso o publicación por su parte de cualquiera de dichos asuntos o de cualquier parte del sitio está estrictamente prohibida.
        </p>

        <h2>5. Enlaces a Terceros</h2>
        <p>
          Nuestro sitio puede contener enlaces a sitios web de terceros que no son de nuestra propiedad ni están controlados por nosotros. No tenemos control sobre el contenido, las políticas de privacidad o las prácticas de los sitios web de terceros y no asumimos ninguna responsabilidad por ellos.
        </p>

        <h2>6. Limitación de Responsabilidad</h2>
        <p>
          En ningún caso nosotros, ni nuestros directores, empleados o agentes, seremos responsables ante usted por daños directos, indirectos, incidentales, especiales, punitivos o consecuentes de ningún tipo que resulten de su uso de este sitio.
        </p>

        <h2>7. Cambios en los Términos</h2>
        <p>
          Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Le notificaremos cualquier cambio publicando los nuevos Términos y Condiciones en esta página. Se le aconseja que revise estos Términos y Condiciones periódicamente para detectar cualquier cambio.
        </p>

        <h2>8. Ley Aplicable</h2>
        <p>
          Estos Términos se regirán e interpretarán de acuerdo con las leyes de Colombia, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
        </p>

        <h2>9. Contáctenos</h2>
        <p>
          Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos en: [Su Información de Contacto]
        </p>
      </div>
    </div>
  );
};

export default TermsModal;
