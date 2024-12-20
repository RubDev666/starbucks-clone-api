import fs from 'fs';
import path from 'path';

// Base directory for the project
const baseDir = path.join(process.cwd(), 'src');

// Directory and file structure
const structure = {
  'assets': {
    'icons': {},
    'images': {},
    'styles': {
      'global.css': '',
      'variables.css': ''
    }
  },
  'components': {
    'common': {
      'Button.tsx': '',
      'Input.tsx': '',
      'Navbar.tsx': ''
    },
    'forms': {
      'LoginForm.tsx': '',
      'RegisterForm.tsx': ''
    },
    'documents': {
      'DocumentList.tsx': '',
      'DocumentEditor.tsx': ''
    }
  },
  'hooks': {
    'useAuth.ts': '',
    'useFetch.ts': ''
  },
  'layouts': {
    'AuthLayout.tsx': '',
    'MainLayout.tsx': ''
  },
  'pages': {
    'Home.tsx': '',
    'Login.tsx': '',
    'Register.tsx': '',
    'Dashboard.tsx': '',
    'Profile.tsx': ''
  },
  'services': {
    'api': {
      'auth.ts': '',
      'documents.ts': ''
    },
    'axiosInstance.ts': ''
  },
  'store': {
    'authSlice.ts': '',
    'documentSlice.ts': '',
    'store.ts': ''
  },
  'types': {
    'auth.ts': '',
    'documents.ts': '',
    'api.ts': ''
  },
  'utils': {
    'helpers.ts': '',
    'constants.ts': ''
  },
  'App.tsx': '',
  'main.tsx': '',
  'vite-env.d.ts': ''
};

// Function to create directories and files recursively
const createStructure = (base, obj) => {
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = path.join(base, key);
    if (typeof value === 'object') {
      // Create directory
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Directory created: ${fullPath}`);
      }
      createStructure(fullPath, value);
    } else {
      // Create file
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, value, 'utf8');
        console.log(`File created: ${fullPath}`);
      }
    }
  }
};

// Create the structure
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}
createStructure(baseDir, structure);

console.log('Project structure created successfully!');
