export const translations = {
  es: {
    // Navigation
    nav: {
      title: "🌱 Diario Wellness",
      journal: "Diario",
      results: "Resultados",
      settings: "Configuración",
    },

    // Main journal page
    journal: {
      title: "🌱 Diario para Conocerte Mejor",
      date: "Fecha:",

      // Morning section
      morning: {
        title: "🌅 Mañana (2 minutos)",
        energyQuestion: "¿Cómo está mi energía ahorita?",
        energyScale:
          "Encierra un número del 1 (súper cansado) al 10 (lleno de energía)",
        lowEnergy: "Poca Energía",
        highEnergy: "Mucha Energía",
        focusQuestion: "¿Qué es una cosa sobre mí mismo que quiero notar hoy?",
        focusHint:
          'Solo una cosa simple - como "ver cuándo sonrío natural" o "notar si estoy forzando pláticas"',
        placeholder: "Escribe aquí...",
      },

      // Afternoon section
      afternoon: {
        title: "☀️ Tarde (2 minutos)",
        energyQuestion: "¿Cómo está mi energía ahorita?",
        energyScale:
          "Encierra un número del 1 (súper cansado) al 10 (lleno de energía)",
        lowEnergy: "Poca Energía",
        highEnergy: "Mucha Energía",
        momentQuestion:
          "¿En qué momento de hoy me he sentido más como yo mismo?",
        momentHint:
          "Piensa en un momento, aunque sea pequeño, donde te sentiste natural y relajado",
        placeholder: "Escribe aquí...",
      },

      // Evening section
      evening: {
        title: "🌙 Noche (5 minutos)",
        energyQuestion: "¿Cómo está mi energía ahorita?",
        energyScale:
          "Encierra un número del 1 (súper cansado) al 10 (lleno de energía)",
        lowEnergy: "Poca Energía",
        highEnergy: "Mucha Energía",
        emotionQuestion: "¿Qué emoción sentí más fuerte hoy?",
        emotionHint:
          'Solo ponle nombre - "frustrado," "curioso," "ansioso," "emocionado," etc. No necesitas analizarlo',
        authenticQuestion: "¿Cuándo me sentí más como yo mismo hoy?",
        authenticHint:
          "Describe cómo se sintió por dentro cuando estabas siendo genuinamente tú",
        actingQuestion:
          "¿Cuándo sentí que estaba actuando o tratando de encajar?",
        actingHint:
          "Describe cómo se sintió por dentro - ¿tenso, cuidadoso, como actuando?",
        admirationQuestion:
          "¿Admiré a alguien hoy? ¿Qué cualidad vi en esa persona que yo ya puedo tener?",
        admirationHint:
          'Piensa: "¿Qué me gustó de esa persona, y cómo esa cualidad ya puede existir en mí?"',
        placeholder: "Escribe aquí...",
      },

      // Save section
       save: {
         button: "Guardar Entrada del Diario",
         saving: "Guardando...",
         success: "✅ Entrada guardada exitosamente",
         error: "❌ Error al guardar:",
         cancel: "Cancelar Entrada",
         confirmCancel: "¿Descartar esta entrada? Todos los cambios no guardados se perderán",
       },

      welcome: {
        greeting: "Hola",
        intro: "¿Listo para tu entrada de hoy?",
        start: "Comenzar",
      },
      thanks: {
        message: "¡Gracias por tu entrada de hoy! 🌟",
        back: "Volver al inicio",
      },
    },

    // Settings page
    settings: {
      title: "⏰ Horarios de Desbloqueo",
      subtitle: "Configura a qué hora se abre cada período del diario",
      morning: "Mañana",
      afternoon: "Tarde",
      evening: "Noche",
      morningLabel: "Desbloqueo Mañana",
      afternoonLabel: "Desbloqueo Tarde",
      eveningLabel: "Desbloqueo Noche",
      save: "Guardar Configuración",
      saving: "Guardando...",
      saved: "✅ Guardado",
      error: "❌ Error al guardar",
      openAt: "Abre a las",
    },
 
    // (removed misplaced English settings block that duplicated key)

    // Auth
    auth: {
      heading: "Inicia sesión para continuar",
      subheading: "Crea una cuenta o accede para guardar tu progreso.",
      email: "Correo electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      signIn: "Iniciar sesión",
      signUp: "Crear cuenta",
      google: "Continuar con Google",
      switchToSignUp: "¿No tienes cuenta? Crear cuenta",
      switchToSignIn: "¿Ya tienes cuenta? Iniciar sesión",
      signOut: "Cerrar sesión",
      loading: "Cargando...",
      alreadySignedIn: "Ya has iniciado sesión.",
      goToApp: "Ir a la app",
      errors: {
        'auth/invalid-credential': 'Credenciales inválidas',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/email-already-in-use': 'El correo ya está en uso',
        'auth/weak-password': 'La contraseña es muy débil',
        'auth/invalid-email': 'Correo inválida',
        'auth/too-many-requests': 'Demasiados intentos, intenta más tarde',
        'auth/operation-not-allowed': 'Inicio con email/contraseña no habilitado',
        'auth/network-request-failed': 'Error de red, verifica tu conexión',
        'auth/invalid-api-key': 'Clave de API de Firebase inválida',
        'auth/internal-error': 'Error interno de autenticación, intenta de nuevo',
        'auth/missing-password': 'Falta la contraseña',
        'password-mismatch': 'Las contraseñas no coinciden',
        generic: 'Ocurrió un error. Intenta de nuevo.'
      }
    },
 


    // Results page
    results: {
      title: "📊 Resultados del Diario",
      subtitle: "Revisa tus entradas pasadas y observa tus patrones",
      loading: "Cargando entradas...",
      error: "Error:",
      noEntries: {
        title: "No hay entradas aún",
        subtitle: "Comienza escribiendo tu primera entrada del diario",
        button: "Escribir Primera Entrada",
      },
      entry: {
        morningFocus: "Enfoque del día:",
        authenticMoment: "Momento auténtico:",
        mainEmotion: "Emoción principal:",
        eveningReflections: "Reflexiones de la noche",
        authenticEvening: "Momento auténtico:",
        acting: "Actuando/Encajando:",
        admiration: "Admiración/Cualidad:",
        edit: "Editar",
        delete: "Borrar",
        confirmDelete: "¿Seguro que quieres borrar esta entrada?",
        save: "Guardar",
        cancel: "Cancelar",
      },
    },
  },

  en: {
    // Navigation
    nav: {
      title: "🌱 Wellness Journal",
      journal: "Journal",
      results: "Results",
      settings: "Settings",
    },

    // Main journal page
    journal: {
      title: "🌱 Daily Journal to Know Yourself Better",
      date: "Date:",

      // Morning section
      morning: {
        title: "🌅 Morning (2 minutes)",
        energyQuestion: "How is my energy right now?",
        energyScale:
          "Circle a number from 1 (super tired) to 10 (full of energy)",
        lowEnergy: "Low Energy",
        highEnergy: "High Energy",
        focusQuestion: "What is one thing about myself I want to notice today?",
        focusHint:
          'Just one simple thing - like "see when I smile naturally" or "notice if I\'m forcing conversations"',
        placeholder: "Write here...",
      },

      // Afternoon section
      afternoon: {
        title: "☀️ Afternoon (2 minutes)",
        energyQuestion: "How is my energy right now?",
        energyScale:
          "Circle a number from 1 (super tired) to 10 (full of energy)",
        lowEnergy: "Low Energy",
        highEnergy: "High Energy",
        momentQuestion: "When did I feel most like myself today?",
        momentHint:
          "Think of a moment, even a small one, where you felt natural and relaxed",
        placeholder: "Write here...",
      },

      // Evening section
      evening: {
        title: "🌙 Evening (5 minutes)",
        energyQuestion: "How is my energy right now?",
        energyScale:
          "Circle a number from 1 (super tired) to 10 (full of energy)",
        lowEnergy: "Low Energy",
        highEnergy: "High Energy",
        emotionQuestion: "What emotion did I feel strongest today?",
        emotionHint:
          'Just name it - "frustrated," "curious," "anxious," "excited," etc. No need to analyze',
        authenticQuestion: "When did I feel most like myself today?",
        authenticHint:
          "Describe how it felt inside when you were being genuinely you",
        actingQuestion:
          "When did I feel like I was acting or trying to fit in?",
        actingHint:
          "Describe how it felt inside - tense, careful, like acting?",
        admirationQuestion:
          "Did I admire someone today? What quality did I see in that person that I might already have?",
        admirationHint:
          'Think: "What did I like about that person, and how might that quality already exist in me?"',
        placeholder: "Write here...",
      },

       // Save section
        save: {
         button: "Save Journal Entry",
         saving: "Saving...",
         success: "✅ Entry saved successfully",
         error: "❌ Error saving:",
         cancel: "Cancel Entry",
         confirmCancel: "Discard this entry? All unsaved changes will be lost",
        },

      welcome: {
        greeting: "Hi",
        intro: "Ready for today's entry?",
        start: "Start",
      },
      thanks: {
        message: "Thanks for today's entry! 🌟",
        back: "Back to start",
      },
    },
 
    // Settings page
    settings: {
      title: "⏰ Unlock Times",
      subtitle: "Set what time each journal period opens",
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      morningLabel: "Morning Unlock",
      afternoonLabel: "Afternoon Unlock",
      eveningLabel: "Evening Unlock",
      save: "Save Settings",
      saving: "Saving...",
      saved: "✅ Saved",
      error: "❌ Error saving",
      openAt: "Opens at",
    },

    // Auth
    auth: {
      heading: "Sign in to continue",
      subheading: "Create an account or sign in to save your progress.",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      signIn: "Sign in",
      signUp: "Sign up",
      google: "Continue with Google",
      switchToSignUp: "Don't have an account? Sign up",
      switchToSignIn: "Already have an account? Sign in",
      signOut: "Sign out",
      loading: "Loading...",
      alreadySignedIn: "You are already signed in.",
      goToApp: "Go to App",
      errors: {
        'auth/invalid-credential': 'Invalid credentials',
        'auth/user-not-found': 'User not found',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email already in use',
        'auth/weak-password': 'Password is too weak',
        'auth/invalid-email': 'Invalid email',
        'auth/too-many-requests': 'Too many attempts, try later',
        'auth/operation-not-allowed': 'Email/password sign-in not enabled',
        'auth/network-request-failed': 'Network error, check your connection',
        'auth/invalid-api-key': 'Invalid Firebase API key',
        'auth/internal-error': 'Internal auth error, try again',
        'auth/missing-password': 'Password is required',
        'password-mismatch': 'Passwords do not match',
        generic: 'An error occurred. Please try again.'
      }
    },

    // Results page
    results: {
      title: "📊 Journal Results",
      subtitle: "Review your past entries and observe your patterns",
      loading: "Loading entries...",
      error: "Error:",
      noEntries: {
        title: "No entries yet",
        subtitle: "Start by writing your first journal entry",
        button: "Write First Entry",
      },
      entry: {
        morningFocus: "Daily focus:",
        authenticMoment: "Authentic moment:",
        mainEmotion: "Main emotion:",
        eveningReflections: "Evening reflections",
        authenticEvening: "Authentic moment:",
        acting: "Acting/Fitting in:",
        admiration: "Admiration/Quality:",
        edit: "Edit",
        delete: "Delete",
        confirmDelete: "Are you sure you want to delete this entry?",
        save: "Save",
        cancel: "Cancel",
      },
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.es;
