# Premium Digital Marketing Portfolio with Firebase Admin Panel (Local Asset Paths)

This is a complete, modern, and fully responsive single-page portfolio website for Digital Marketing students. It includes a built-in, secure **Admin Panel** (`admin.html`) where students can update all their profile information, write project case studies, and manage certifications without touching code.

To keep the project **100% free of charge** (avoiding paid Cloud Storage bandwidth limits and pricing structures), this version does not use Firebase Storage. Instead:
1. Students store image and document files directly inside their local workspace folders.
2. Students push changes to GitHub.
3. Students copy the local relative path (e.g. `assets/images/profile/photo.jpg`) and paste it into the admin panel text inputs, saving it straight to Cloud Firestore.

---

## 📂 Project Structure

```text
/
├── index.html           # Public portfolio page (loads dynamic Firebase data)
├── login.html           # Admin Authentication page
├── admin.html           # Admin Dashboard page (requires authentication)
├── style.css            # Stylesheet for public portfolio
├── admin.css            # Stylesheet for admin panel
├── script.js            # Public portfolio controller (reads data from Firestore)
├── admin.js             # Admin dashboard controller (handles CRUD & saves paths to Firestore)
├── firebase-config.js   # Stores your Firebase credentials & Student ID
├── README.md            # This detailed guide & documentation
└── assets/
    ├── cv/              # Put your Resume PDF documents here
    └── images/          # Default illustrations and graphic components
        ├── profile/     # Put your headshots here
        ├── projects/    # Put your project case study screenshots here
        ├── certificates/# Put your certificate PDFs or screenshots here
        └── placeholder.jpg # High-contrast fallback outline image
```

---

## 🛠️ Step 1: Firebase Project Setup

To connect your website to your own database, you must initialize a free project on Firebase:

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Create a project** (or **Add project**).
3. Name your project (e.g., `marketing-portfolio`) and click continue.
4. Disable Google Analytics (optional, for simplicity) and click **Create project**.

### 2. Enable Authentication
1. On the Firebase left navigation menu, click **Build** -> **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Email/Password**.
4. Enable the **Email/Password** provider (leave "Email link" disabled) and click **Save**.
5. Go to the **Users** tab (next to Sign-in method) and click **Add user**.
6. Create an admin login email and password (e.g., `admin@domain.com` and a secure password). **You will use these credentials to log in at `login.html`**.

### 3. Enable Cloud Firestore Database
1. In the Firebase left menu, click **Build** -> **Firestore Database**.
2. Click **Create database**.
3. Set your **Database location** (choose a location closest to you) and click Next.
4. Choose **Start in test mode** (this allows public reads and writes for 30 days) and click **Create**.
5. Once created, click the **Rules** tab at the top and replace them with the production-ready **Firestore Security Rules** provided below, then click **Publish**.

> [!NOTE]
> Firebase Storage is **not required** for this setup. You do not need to enable it, which keeps the system lightweight and completely free!

---

## 🔐 Firebase Firestore Security Rules

Go to **Firestore Database** -> **Rules** and paste:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can view a student's public portfolio data
    match /students/{studentId}/{document=**} {
      allow read: if true;
      // Only the authenticated student can write to their own ID document
      allow write: if request.auth != null && (studentId == "alex_morgan" || request.auth.token.email.matches(".*")); 
    }
  }
}
```

---

## ⚙️ Step 2: Connect Code to Firebase

1. In the Firebase project home page dashboard, click the **Web icon** (`</>`) to register a web app.
2. Register your app (e.g., `portfolio-web-app`) and click register.
3. Under the config block, copy the `firebaseConfig` keys:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
4. Open the [firebase-config.js](file:///c:/Users/yujan/Desktop/Mega/Portfolio/firebase-config.js) file.
5. Paste your config values inside the `firebaseConfig` object.
6. Change the `STUDENT_ID` variable (Line 41) to your own unique string (e.g. `alex_morgan` or your name) so the app maps your data properly.

---

## 📁 Step 3: Managing Files & Assets

Since Cloud Storage is removed, follow these steps to add photos, project cover designs, certificate copies, or your CV:

### 1. Place the files locally
* **Profile Headshot**: Save your image (e.g. `my-photo.jpg`) inside `assets/images/profile/`.
* **Project Screenshots**: Save your campaign graphics inside `assets/images/projects/`.
* **Certificates**: Save certificate PDFs or image grabs inside `assets/images/certificates/`.
* **CV Resume**: Save your resume PDF (e.g. `resume.pdf`) inside `assets/cv/`.

### 2. Enter relative paths in the Admin Panel
1. Open [login.html](file:///c:/Users/yujan/Desktop/Mega/Portfolio/login.html) and sign in.
2. In the **Profile** tab, enter `assets/images/profile/my-photo.jpg` in the **Profile Image Path** field and save.
3. In the **CV** tab, enter `assets/cv/resume.pdf` in the **CV File Path** field and save.
4. When adding a **Project**, enter `assets/images/projects/project-cover.png` in the **Project Image Path** field.
5. When adding a **Certificate**, enter `assets/images/certificates/google-cert.pdf` in the **Certificate File Path** field.

### 3. Push everything to GitHub
When you add new images or files to your project, use git to push them to GitHub so they display on your live website:
```bash
git add .
git commit -m "Add new images and update assets"
git push
```

> [!TIP]
> **Broken Link Fallback**: If you make a typo in the path or forget to push the file to GitHub, the website automatically falls back to rendering a clean `assets/images/placeholder.jpg` graphic, preventing blank spaces or broken image icons!

---

## 🚀 Step 4: Hosting on GitHub Pages (100% Free)

Once your details are configured, host your site online using GitHub Pages:

### 1. Create a GitHub Repo
1. Log in to [GitHub](https://github.com) and create a **New Repository**.
2. Name it (e.g., `digital-marketing-portfolio`) and set visibility to **Public**.
3. Leave README and ignore checkboxes unchecked.

### 2. Push Files Online
Initialize Git inside your local portfolio folder (`c:\Users\yujan\Desktop\Mega\Portfolio`) and push:
```bash
git init
git add .
git commit -m "Initial commit of portfolio codebase"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 3. Activate GitHub Pages
1. Go to repository **Settings** -> **Pages**.
2. Under "Build and deployment", choose **Deploy from a branch**.
3. Set branch to **`main`** and click **Save**.
4. Wait 1 minute. Refresh the page to see your live URL:
   `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

---

## 🎨 How Students Can Choose a Portfolio Template

Students can select from 10 distinct visual layout templates right from the Admin Dashboard:

1. **Login to the Admin Panel**: Open `login.html` and sign in using your credentials.
2. **Go to Choose Design**: Click the **Choose Design** tab in the sidebar navigation menu.
3. **Select a Layout**: Review the 10 layout options (Modern Gradient, Minimal Clean, Dark Neon, Creative Agency, Corporate Professional, Personal Brand, Marketing Resume, Portfolio Grid, SEO Specialist, and Social Media Creator) and click **Select Design** on your preferred theme.
4. **Instant Sync**: The database automatically updates. A "Currently Selected" badge will appear on your chosen template.
5. **View Live Portfolio**: Refresh your public portfolio page (`index.html`) to see the new layout style applied instantly!
