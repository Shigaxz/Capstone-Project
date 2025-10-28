import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

// --- Configuración de Firebase (Tu configuración) ---
const firebaseConfigString = typeof __firebase_config !== 'undefined'
  ? __firebase_config
  : JSON.stringify({
      apiKey: "AIzaSyCpmT0yVz2P8VmAY4zpqRILRaEw7jKGWvo",
      authDomain: "n8nchat-c8fd0.firebaseapp.com",
      projectId: "n8nchat-c8fd0",
      storageBucket: "n8nchat-c8fd0.firebasestorage.app",
      messagingSenderId: "947496552779",
      appId: "1:947496552779:web:9fd84c3993b10a42ee40ce",
      measurementId: "G-93QYDRYZPR"
    });

let app;
let auth;

try {
  const firebaseConfig = JSON.parse(firebaseConfigString);
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.error("Error inicializando Firebase. Revisa tu configuración.", error);
}

const IconFiLoader = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);

const IconTbMessageChatbotFilled = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7.66l-3.32 2.9A1 1 0 0 1 3 21.12V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10ZM8 9.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm4 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm4 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"></path>
  </svg>
);

// --- Componente del Formulario de Autenticación ---
const AuthForm = ({
  isLoginView,
  setIsLoginView,
  onLogin,
  onSignUp,
  authLoading,
  authError,
  onClose
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginView) {
      onLogin(email, password);
    } else {
      onSignUp(email, password);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Encabezado */}
      <div className="p-4 colores-epysa text-white rounded-t-2xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <TbMessageChatbotFilled className='w-8 h-8'/>
          <div>
            <p className="text-lg font-semibold">{isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta'}</p>
            <p className="text-xs text-gray-300">Asistente de Implementos EPYSA</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20" title="Cerrar">
          <FiX size={24} />
        </button>
      </div>

      {/* Área del Formulario */}
      <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50">
        <div className="relative">
          <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={authLoading}
          />
        </div>
        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={authLoading}
          />
        </div>
        
        {authError && (
          <p className="text-xs text-red-600 text-center px-4">{authError}</p>
        )}

        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 disabled:bg-gray-400 flex items-center justify-center gap-2"
          disabled={authLoading || !email || !password}
        >
          {authLoading ? (
            <IconFiLoader className="animate-spin w-5 h-5" />
          ) : (
            isLoginView ? <FiLogIn className="w-5 h-5" /> : <FiUser className="w-5 h-5" />
          )}
          {authLoading ? 'Procesando...' : (isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta')}
        </button>
      </form>

      {/* Pie de página para cambiar de vista */}
      <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
        <button
          onClick={() => setIsLoginView(!isLoginView)}
          className="text-sm text-blue-600 hover:underline text-center w-full"
          disabled={authLoading}
        >
          {isLoginView ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
        </button>
      </div>
    </div>
  );
};

// Interfaz del Chat con tu lógica n8n 
const ChatInterface = ({ userEmail, onLogout, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // webhook n8n 
  async function sendMessageToN8n(message, sessionId) {
    const webhookUrl = 'http://localhost:5678/webhook/80a5663d-7186-4f19-8b15-316f7aac4965';
    const data = { text: message, sessionId: sessionId };
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result.output;
    } catch (error) {
      console.error('Error al contactar el webhook:', error);
      return "Lo siento, no pude conectarme. Inténtalo de nuevo.";
    }
  }

   useEffect(() => {
    setSessionId(nanoid());
    setMessages([{
     sender: 'bot',
      text: '¡Hola! Soy Epybot. ¿Cómo puedo ayudarte?'
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    // Llamada  función n8n
    const botResponseText = await sendMessageToN8n(currentInput, sessionId);
    setIsLoading(false);
    if (botResponseText) {
      const botMessage = { sender: 'bot', text: botResponseText };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };
// Encabezado del Chat 
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 colores-epysa text-white rounded-t-2xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 min-w-0">
          <TbMessageChatbotFilled className='w-8 h-8 flex-shrink-0'/>
          <div className="min-w-0">
            <p className="text-lg font-semibold">Epybot</p>
            <p className="text-xs text-gray-300 truncate" title={userEmail}>{userEmail || 'Invitado'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onLogout} className="p-1 rounded-full hover:bg-white/20" title="Cerrar Sesión">
            <PiSignOutBold className="w-6 h-6" />
          </button>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20" title="Cerrar Chat">
            <MdClose className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Área de Mensajes */}
      <div className="flex-1 p-2 sm:p-6 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 bg-gray-200 rounded-2xl shadow rounded-bl-none">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-0"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-400"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Área de Entrada de Texto */}
      <form onSubmit={handleFormSubmit} className="p-3 border-t bg-gray-100 rounded-b-2xl">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje aquí..."
            className="flex-1 w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 disabled:bg-gray-400"
            disabled={!input.trim() || isLoading}
          >
            <FiSend className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Componente Principal (App) ---

export default function Frontchatbot({ iconClosed }) { 
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); 
  const [authError, setAuthError] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      setAuthError("Error: Servicio de autenticación no disponible.");
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); 
      setAuthLoading(false); 
      setAuthError(''); 
      if (user) {
        setIsLoginView(true); 
      }
    });
    
    return () => unsubscribe();
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setAuthError(''); 
    }
  };

  const handleLogin = async (email, password) => {
    if (!auth) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (email, password) => {
    if (!auth) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const getFirebaseErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'El formato del correo es inválido.';
      case 'auth/user-not-found':
        return 'No se encontró un usuario con este correo.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/operation-not-allowed':
        return 'Inicio de sesión por correo y contraseña no habilitado.';
      case 'auth/invalid-credential':
          return 'Credenciales inválidas o caducadas.';
      default:
        console.error("Error de Firebase:", error);
        return 'Ocurrió un error. Inténtalo de nuevo.';
    }
  };

  return (
    <>
    
     
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end font-sans">
        
        {/* Ventana del Chat (Contenido dinámico) */}
        <div
          className={`
            w-80 sm:w-96 h-[500px] max-h-[70vh] mb-4 bg-white rounded-2xl shadow-2xl
            flex flex-col transition-all duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : 'hidden translate-x-1000 pointer-events-none'}
          `}
        >
          {authLoading ? (
            <div className="flex items-center justify-center h-full">
              <IconFiLoader className="animate-spin w-12 h-12 text-blue-600" />
            </div>
          ) : currentUser ? (
            <ChatInterface
              userEmail={currentUser.email}
              onLogout={handleLogout}
              onClose={toggleChat}
            />
          ) : (
            <AuthForm
              isLoginView={isLoginView}
              setIsLoginView={setIsLoginView}
              onLogin={handleLogin}
              onSignUp={handleSignUp}
              authLoading={authLoading}
              authError={authError}
              onClose={toggleChat}
            />
          )}
        </div>
          
        {/* Botón Flotante principal  */}
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-slate-700 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-transform transform hover:scale-110"
          aria-label="Toggle Chatbot"
        >
          <div className={`transition-opacity duration-300 absolute ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
            {!isOpen && iconClosed}
            <TbMessageChatbotFilled className='w-8 h-8'/>
          </div>
          <div className={`transition-opacity duration-300 absolute ${isOpen ? 'opacity-1className scale-100' : 'opacity-0 scale-90'}`}>
            {isOpen && <FiX size={32} />}
          </div>
        </button>
      </div>
    </>
  );
}