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
        <h1>TÉRMINOS Y CONDICIONES</h1>
   
        <p>En el CESA creemos en la fuerza transformadora de la educación y en el compromiso solidario de nuestra comunidad. Por ello, hemos creado ELEVA, el fondo filantrópico que canaliza las donaciones de egresados, aliados y amigos hacia becas y apoyos que impulsan el talento de estudiantes destacados que requieren respaldo económico.</p>
        <p>La presente plataforma de donaciones en línea ha sido diseñada para que cualquier persona pueda contribuir de manera segura, transparente y sencilla. Al realizar una donación, usted reconoce la importancia de apoyar la misión educativa del CESA y acepta los términos y condiciones aquí establecidos, que regulan la gestión de los aportes recibidos.</p>

        <h2>1. Seguridad en la plataforma</h2>
        <p>La plataforma de donaciones en línea del CESA cuenta con protocolos de seguridad (https://) y certificados digitales que garantizan la autenticidad de la transacción y la protección de los datos del donante.</p>

        <h2>2. Naturaleza de la donación</h2>
        <p>El diligenciamiento del formulario de donación constituye, para efectos legales, una oferta de donación en los términos del Código Civil colombiano. La donación es un acto voluntario y altruista, sin contraprestación económica o contractual a favor del donante.</p>

        <h2>3. Obligaciones del donante</h2>
        <ul>
          <li>Ser plenamente capaz de realizar el acto jurídico de donar.</li>
          <li>Ser titular del medio de pago utilizado.</li>
          <li>Declarar y garantizar que los recursos provienen de actividades lícitas.</li>
          <li>Autorizar al CESA a debitar el valor correspondiente de acuerdo con el formulario diligenciado.</li>
          <li>Mantener la reserva y confidencialidad sobre la información a la cual tenga acceso en conexión con la donación, relacionada con el CESA y/o los beneficiarios.</li>
          <li>Suministrar toda la información que requiera el CESA para legalizar la donación</li>
          <li>Hacer uso de la plataforma con responsabilidad y honestidad</li>
        </ul>

        <h2>4. Donaciones recurrentes</h2>
        <p>El donante podrá programar donaciones recurrentes con montos y periodicidades definidos. Podrá modificarlas, suspenderlas o cancelarlas en cualquier momento enviando comunicación escrita a filantropia@cesa.edu.co.</p>
        <p>Dependiendo de la modalidad y el canal de donación, existirán unas reglas relativas a los montos donados, las cuales serán publicadas en esta página y actualizadas periódicamente. Las donaciones que excedan de cincuenta (50) salarios mínimos legales vigentes requerirán el otorgamiento de una escritura de insinuación, de conformidad con el Código Civil colombiano. En este caso, luego de la oferta de donación, el CESA procederá a coordinar con el donante el otorgamiento de dicha escritura. Para ello, el donante deberá suministrar los documentos requeridos por el notario.</p>

        <h2>5. Certificación de donaciones</h2>
        <p>Toda donación será certificada por el CESA de acuerdo con la normatividad tributaria vigente y, cuando aplique, permitirá al donante acceder a beneficios fiscales conforme al Estatuto Tributario.</p>

        <h2>6. Asignación de becas y destinación de recursos</h2>
        <p>El CESA, a través de sus instancias académicas y administrativas, es el único responsable de llevar a cabo el proceso de selección de los beneficiarios y asignación de becas y apoyos financiados con las donaciones recibidas en ELEVA. Dicho proceso se realiza con criterios objetivos de mérito académico, necesidad económica y equidad, garantizando transparencia e imparcialidad.</p>
        <p>El donante no tiene potestad de designar ni influir en la selección de los estudiantes beneficiarios.</p>

        <h2>7. Confidencialidad y tratamiento de datos personales</h2>
        <p>El CESA garantiza la confidencialidad y seguridad de los datos personales recolectados en el marco de ELEVA, conforme a la Ley 1581 de 2012, el Decreto 1377 de 2013 y su Política Institucional de Protección de Datos Personales, disponible en www.cesa.edu.co.</p>

        <h2>8. Declaración de origen de recursos</h2>
        <p>El donante manifiesta, bajo gravedad de juramento, que los recursos entregados provienen de actividades lícitas y autoriza al CESA a realizar las verificaciones correspondientes en cumplimiento de las normas de prevención de lavado de activos y financiación del terrorismo (SARLAFT).</p>

        <h2>9. Propiedad intelectual</h2>
        <p>Todos los contenidos, materiales y marcas incluidos en la plataforma de donaciones son propiedad del CESA y están protegidos por la normativa nacional e internacional de derechos de autor y propiedad industrial.</p>

        <h2>10. Política de reembolsos y errores en transacciones</h2>
        <p>Las donaciones no son reembolsables. No obstante, en caso de errores en la digitación del monto, doble cobro o fallas técnicas comprobadas, el donante podrá solicitar revisión enviando comunicación a filantropia@cesa.edu.co dentro de los treinta (30) días siguientes a la transacción.</p>

        <h2>11. Transparencia e informes de impacto</h2>
        <p>El CESA se compromete a presentar informes periódicos sobre la gestión de los recursos recibidos a través de ELEVA, incluyendo indicadores de impacto, destinación de recursos y beneficiarios alcanzados, como parte de su compromiso de rendición de cuentas.</p>

        <h2>12. Uso de la imagen y reconocimiento al donante</h2>
        <p>El CESA podrá, salvo manifestación expresa en contrario del donante, reconocer públicamente el aporte recibido mediante listados de benefactores, eventos o publicaciones institucionales. El donante podrá solicitar anonimato en cualquier momento.</p>

        <h2>13. Pasarela de pagos y terceros</h2>
        <p>Las transacciones se realizan a través de pasarelas de pago certificadas. Estas pasarelas cuentan con sus propios términos y condiciones que deberán ser aceptados adicionalmente por el donante.</p>

        <h2>14. Cláusula de modificación de términos</h2>
        <p>El CESA podrá modificar los presentes términos y condiciones en cualquier momento. Las modificaciones serán publicadas en la página web y aplicarán a las donaciones realizadas a partir de dicha publicación.</p>

        <h2>15. Atención de quejas y reclamos</h2>
        <p>Los donantes podrán dirigir sus inquietudes, quejas o reclamos al correo electrónico filantropia@cesa.edu.co o al teléfono institucional. El CESA dará respuesta en un plazo máximo de quince (15) días hábiles.</p>

        <h2>16. Vigencia</h2>
        <p>Estos términos y condiciones estarán vigentes desde su publicación en la página web y aplican para todas las donaciones realizadas desde ese momento.</p>

        <h2>17. Ley aplicable y jurisdicción</h2>
        <p>Estos términos y condiciones se rigen por las leyes de la República de Colombia. En caso de controversia, será competente la jurisdicción ordinaria colombiana.</p>
      </div>
    </div>
  );
};

export default TermsModal;
