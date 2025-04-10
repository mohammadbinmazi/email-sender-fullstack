import EmailForm from "../components/EmailForm";

const ContactPage = ({ onLogout }) => {
  return (
    <div>
      <EmailForm onLogout={onLogout} />
    </div>
  );
};

export default ContactPage;
