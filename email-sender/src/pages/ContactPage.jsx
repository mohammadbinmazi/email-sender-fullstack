// import EmailForm from "../components/EmailForm";

// const ContactPage = () => {
//   return (
//     <div>
//       <EmailForm />
//     </div>
//   );
// };

// export default ContactPage;
import EmailForm from "../components/EmailForm";

const ContactPage = ({ onLogout }) => {
  return (
    <div>
      <EmailForm onLogout={onLogout} />
    </div>
  );
};

export default ContactPage;
