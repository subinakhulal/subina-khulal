/**
 * Admin Dashboard - Interaction and Firebase Logic (Path-based Version)
 * 
 * Manages:
 * 1. Authentication Check & Guards
 * 2. Tab Navigation System
 * 3. Profile Info & Profile Photo Path Management
 * 4. Skills Management (Firestore CRUD)
 * 5. Projects Management (Firestore CRUD & Image Paths)
 * 6. Certifications Management (Firestore CRUD & File Paths)
 * 7. CV Management (PDF path validation)
 * 8. Socials & Contact Form Management
 * 9. Toast Notifications & Deletion Confirmations Modals
 */

// Helper functions for path sanitization and validation
function cleanAssetPath(path) {
    if (!path) return "";
    return path.trim().replace(/^\/+/, "");
}

function getImagePath(path) {
    const cleanPath = cleanAssetPath(path);
    return cleanPath || "assets/images/placeholder.jpg";
}

function isPdf(path) {
    return path && path.toLowerCase().endsWith(".pdf");
}

document.addEventListener('DOMContentLoaded', () => {

    // Active Tab tracking state
    let activeTabId = 'tab-profile';
    
    // Deletion states tracking
    let pendingDeleteId = null;
    let pendingDeleteType = null; // 'skill', 'project', 'cert'

    // Helper to update sidebar logo dynamically
    function updateSidebarLogo(name) {
        if (!name) return;
        const firstName = name.split(' ')[0];
        const lastName = name.split(' ').slice(1).join(' ') || 'Marketing';
        const logoEl = document.getElementById('adminSidebarLogo');
        if (logoEl) {
            logoEl.innerHTML = `<span>${firstName}</span>${lastName}`;
        }
    }

    // ==========================================
    // AUTHENTICATION GUARD
    // ==========================================
    if (!isFirebaseConfigured || !auth || !db) {
        showToast("Firebase not configured! Redirecting to login...", "error");
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    auth.onAuthStateChanged(user => {
        if (!user) {
            // Unauthenticated - redirect to login
            window.location.href = 'login.html';
        } else {
            // Authenticated - display email and load all portfolio data
            document.getElementById('userEmailDisplay').textContent = user.email;
            loadAllData();
        }
    });

    // Logout Action
    document.getElementById('logoutBtn').addEventListener('click', () => {
        showLoading(true, "Logging Out...");
        auth.signOut()
            .then(() => {
                window.location.href = 'login.html';
            })
            .catch(error => {
                showLoading(false);
                showToast("Logout failed: " + error.message, "error");
            });
    });


    // ==========================================
    // SIDEBAR TAB NAVIGATION CONTROLLER
    // ==========================================
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const tabTitleHeader = document.getElementById('currentTabTitle');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state from all nav buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            // Hide all tab panes
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Set current active button
            btn.classList.add('active');
            
            // Show target tab pane
            const targetTab = btn.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
            
            // Update Topbar header title
            tabTitleHeader.textContent = btn.innerText.trim();
            activeTabId = targetTab;
            
            // Mobile Sidebar drawer close helper
            if (window.innerWidth <= 768) {
                document.querySelector('.admin-sidebar').classList.remove('active');
            }
        });
    });


    // ==========================================
    // INITIAL LOAD & COMBINED DATA FETCH
    // ==========================================
    function loadAllData() {
        showLoading(true, "Fetching portfolio content...");
        
        const docRef = db.collection('students').doc(STUDENT_ID);
        
        docRef.get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                
                // Populate Profile fields
                document.getElementById('profileName').value = data.name || '';
                document.getElementById('profileTitle').value = data.title || '';
                document.getElementById('profileBio').value = data.bio || '';
                document.getElementById('profileAbout').value = data.about || '';
                document.getElementById('profileLocation').value = data.location || '';
                document.getElementById('profileHeroBadge').value = data.heroBadgeText || '';
                document.getElementById('profileTypewriterRoles').value = data.typewriterRoles || '';
                document.getElementById('profileEducation').value = data.educationText || '';
                document.getElementById('profileAvailability').value = data.availabilityText || '';
                document.getElementById('profileExpYears').value = data.expYears || '';
                document.getElementById('profileExpLabel').value = data.expLabel || '';
                
                // Set Profile image path input & preview
                const photoPath = data.profilePhotoPath || '';
                document.getElementById('profilePhotoPath').value = photoPath;
                document.getElementById('avatarPreview').src = getImagePath(photoPath);
                document.getElementById('sidebarAvatar').src = getImagePath(photoPath);

                if (data.name) {
                    document.getElementById('sidebarName').textContent = data.name;
                    updateSidebarLogo(data.name);
                    document.title = `Admin Dashboard | ${data.name}`;
                }

                // Populate CV details
                const cvPathVal = data.cvPath || '';
                document.getElementById('cvPath').value = cvPathVal;
                updateCvStatusUI(cvPathVal);

                // Populate Contact & Socials Form
                document.getElementById('contactEmail').value = data.email || '';
                document.getElementById('contactPhone').value = data.phone || '';
                document.getElementById('contactWhatsapp').value = data.whatsapp || '';
                document.getElementById('contactAddress').value = data.location || '';

                if (data.socials) {
                    const s = data.socials;
                    document.getElementById('socialLinkedin').value = s.linkedin || '';
                    document.getElementById('socialInstagram').value = s.instagram || '';
                    document.getElementById('socialFacebook').value = s.facebook || '';
                    document.getElementById('socialTiktok').value = s.tiktok || '';
                    document.getElementById('socialYoutube').value = s.youtube || '';
                    document.getElementById('socialGithub').value = s.github || '';
                }
            } else {
                console.log("No student document found. Saving details will create it.");
                showToast("No active portfolio settings found. Save your profile to initialize.", "info");
            }
            
            // Load Subcollections & Selected Template
            loadSkills();
            loadProjects();
            loadCertifications();
            loadExperience();
            loadTestimonials();
            loadSelectedTemplate();
            
            showLoading(false);
        }).catch(error => {
            showLoading(false);
            console.error("Error loading data: ", error);
            showToast("Failed to fetch data: " + error.message, "error");
        });
    }

    function updateCvStatusUI(cvPathVal) {
        const cvStatusBox = document.getElementById('cvStatusBox');
        const cvStatusBoxEmpty = document.getElementById('cvStatusBoxEmpty');
        const currentCvLink = document.getElementById('currentCvLink');

        if (cvPathVal) {
            cvStatusBox.style.display = 'flex';
            cvStatusBoxEmpty.style.display = 'none';
            currentCvLink.href = cleanAssetPath(cvPathVal);
        } else {
            cvStatusBox.style.display = 'none';
            cvStatusBoxEmpty.style.display = 'flex';
        }
    }


    // ==========================================
    // PROFILE SETTINGS LOGIC
    // ==========================================
    const profileForm = document.getElementById('profileForm');
    const photoPathForm = document.getElementById('photoPathForm');
    
    // Save Profile text fields
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showLoading(true, "Saving profile configurations...");

        const name = document.getElementById('profileName').value.trim();
        const title = document.getElementById('profileTitle').value.trim();
        const bio = document.getElementById('profileBio').value.trim();
        const about = document.getElementById('profileAbout').value.trim();
        const location = document.getElementById('profileLocation').value.trim();
        const heroBadgeText = document.getElementById('profileHeroBadge').value.trim();
        const typewriterRoles = document.getElementById('profileTypewriterRoles').value.trim();
        const educationText = document.getElementById('profileEducation').value.trim();
        const availabilityText = document.getElementById('profileAvailability').value.trim();
        const expYears = document.getElementById('profileExpYears').value.trim();
        const expLabel = document.getElementById('profileExpLabel').value.trim();

        const studentData = {
            name,
            title,
            bio,
            about,
            location,
            heroBadgeText,
            typewriterRoles,
            educationText,
            availabilityText,
            expYears,
            expLabel
        };

        db.collection('students').doc(STUDENT_ID).set(studentData, { merge: true })
            .then(() => {
                showLoading(false);
                document.getElementById('sidebarName').textContent = name;
                updateSidebarLogo(name);
                document.title = `Admin Dashboard | ${name}`;
                showToast("Profile text settings updated!");
            })
            .catch(error => {
                showLoading(false);
                showToast("Failed to update profile: " + error.message, "error");
            });
    });

    // Save Profile photo path
    photoPathForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pathInput = document.getElementById('profilePhotoPath');
        const cleanedPath = cleanAssetPath(pathInput.value);
        
        showLoading(true, "Updating image reference...");

        db.collection('students').doc(STUDENT_ID).set({
            profilePhotoPath: cleanedPath
        }, { merge: true }).then(() => {
            showLoading(false);
            
            // Update UI preview elements
            const finalPath = getImagePath(cleanedPath);
            document.getElementById('avatarPreview').src = finalPath;
            document.getElementById('sidebarAvatar').src = finalPath;
            
            showToast("Profile photo path updated!");
        }).catch(error => {
            showLoading(false);
            showToast("Failed to save path: " + error.message, "error");
        });
    });

    // Real-time photo preview when typing
    document.getElementById('profilePhotoPath').addEventListener('input', (e) => {
        const value = e.target.value;
        document.getElementById('avatarPreview').src = getImagePath(value);
    });


    // ==========================================
    // SKILLS LOGIC (CRUD)
    // ==========================================
    const skillForm = document.getElementById('skillForm');
    const skillLevelSlider = document.getElementById('skillLevel');
    const skillLevelVal = document.getElementById('skillLevelVal');
    const skillsTableBody = document.getElementById('skillsTableBody');
    const cancelSkillEditBtn = document.getElementById('cancelSkillEditBtn');

    // Slider value observer
    skillLevelSlider.addEventListener('input', () => {
        skillLevelVal.textContent = skillLevelSlider.value + '%';
    });

    // Load active skills table
    function loadSkills() {
        db.collection('students').doc(STUDENT_ID).collection('skills')
            .get()
            .then(snapshot => {
                skillsTableBody.innerHTML = '';
                
                if (snapshot.empty) {
                    skillsTableBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No skills found. Add a skill from the form.</td></tr>';
                    return;
                }

                snapshot.forEach(doc => {
                    const skill = doc.data();
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><strong>${skill.name}</strong></td>
                        <td>
                            <div class="progress-bar-wrapper" style="max-width: 150px;">
                                <div class="progress-bar-fill" style="width: ${skill.level}%"></div>
                            </div>
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--admin-color-text-muted)">${skill.level}%</span>
                        </td>
                        <td>
                            <div class="actions-cell-wrapper">
                                <button class="btn-admin btn-admin-secondary btn-icon-only edit-skill-btn" data-id="${doc.id}" data-name="${skill.name}" data-level="${skill.level}" title="Edit Skill">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="btn-admin btn-admin-danger btn-icon-only delete-skill-btn" data-id="${doc.id}" title="Delete Skill">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    skillsTableBody.appendChild(tr);
                });

                // Attach button list events
                attachSkillsEvents();
            });
    }

    // Save skill (Create or Update)
    skillForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const skillId = document.getElementById('editSkillId').value;
        const name = document.getElementById('skillName').value.trim();
        const level = parseInt(skillLevelSlider.value);

        if (!name) return;

        showLoading(true, "Saving skill...");

        const skillData = { name, level };
        const skillsCollection = db.collection('students').doc(STUDENT_ID).collection('skills');

        const savePromise = skillId 
            ? skillsCollection.doc(skillId).update(skillData) // Edit mode
            : skillsCollection.add(skillData); // Add mode

        savePromise.then(() => {
            showLoading(false);
            resetSkillForm();
            loadSkills();
            showToast(skillId ? "Skill updated successfully!" : "New skill added successfully!");
        }).catch(error => {
            showLoading(false);
            showToast("Failed to save skill: " + error.message, "error");
        });
    });

    function attachSkillsEvents() {
        // Edit Skill
        document.querySelectorAll('.edit-skill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const name = btn.getAttribute('data-name');
                const level = btn.getAttribute('data-level');

                document.getElementById('editSkillId').value = id;
                document.getElementById('skillName').value = name;
                skillLevelSlider.value = level;
                skillLevelVal.textContent = level + '%';

                document.getElementById('skillFormTitle').textContent = "Edit Skill";
                document.getElementById('saveSkillBtn').textContent = "Update Skill";
                cancelSkillEditBtn.style.display = 'inline-flex';
            });
        });

        // Delete Skill Trigger
        document.querySelectorAll('.delete-skill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                pendingDeleteId = btn.getAttribute('data-id');
                pendingDeleteType = 'skill';
                document.getElementById('deleteModal').classList.add('active');
            });
        });
    }

    cancelSkillEditBtn.addEventListener('click', resetSkillForm);

    function resetSkillForm() {
        document.getElementById('editSkillId').value = '';
        document.getElementById('skillName').value = '';
        skillLevelSlider.value = 80;
        skillLevelVal.textContent = '80%';
        
        document.getElementById('skillFormTitle').textContent = "Add New Skill";
        document.getElementById('saveSkillBtn').textContent = "Add Skill";
        cancelSkillEditBtn.style.display = 'none';
    }


    // ==========================================
    // PROJECTS LOGIC (CRUD & IMAGE PATHS)
    // ==========================================
    const projectForm = document.getElementById('projectForm');
    const projectImagePath = document.getElementById('projectImagePath');
    const projectThumbnailBox = document.getElementById('projectThumbnailBox');
    const projectThumbnail = document.getElementById('projectThumbnail');
    const projectsList = document.getElementById('projectsList');
    const cancelProjectEditBtn = document.getElementById('cancelProjectEditBtn');

    // Real-time project image preview
    projectImagePath.addEventListener('input', (e) => {
        const val = e.target.value;
        if (val) {
            projectThumbnail.src = getImagePath(val);
            projectThumbnailBox.style.display = 'block';
        } else {
            projectThumbnailBox.style.display = 'none';
        }
    });

    // Load active projects list
    function loadProjects() {
        db.collection('students').doc(STUDENT_ID).collection('projects')
            .get()
            .then(snapshot => {
                projectsList.innerHTML = '';
                
                if (snapshot.empty) {
                    projectsList.innerHTML = '<div class="text-center text-muted card-empty">No projects added yet. Add a project from the editor form.</div>';
                    return;
                }

                snapshot.forEach(doc => {
                    const project = doc.data();
                    const card = document.createElement('div');
                    card.className = 'admin-project-item-card';
                    
                    const toolsBadges = (project.tools || '').split(',')
                        .map(t => `<span>${t.trim()}</span>`)
                        .join(' ');

                    card.innerHTML = `
                        <img src="${getImagePath(project.imagePath)}" alt="${project.title}" class="project-item-thumbnail" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                        <div class="project-item-details">
                            <h4>${project.title}</h4>
                            <p>${project.description}</p>
                            <div class="project-tools-badges">${toolsBadges}</div>
                        </div>
                        <div class="actions-cell-wrapper">
                            <button class="btn-admin btn-admin-secondary btn-icon-only edit-project-btn" 
                                data-id="${doc.id}" 
                                data-title="${project.title}" 
                                data-description="${project.description}" 
                                data-tools="${project.tools || ''}" 
                                data-link="${project.link || ''}" 
                                data-path="${project.imagePath || ''}" 
                                title="Edit Project">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn-admin btn-admin-danger btn-icon-only delete-project-btn" data-id="${doc.id}" title="Delete Project">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    `;
                    projectsList.appendChild(card);
                });

                attachProjectsEvents();
            });
    }

    // Save project
    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const projectId = document.getElementById('editProjectId').value;
        const title = document.getElementById('projectTitle').value.trim();
        const description = document.getElementById('projectDescription').value.trim();
        const tools = document.getElementById('projectTools').value.trim();
        const link = document.getElementById('projectLink').value.trim();
        const rawPath = projectImagePath.value;
        
        if (!title || !description) return;

        const cleanedPath = cleanAssetPath(rawPath);

        const projectData = {
            title,
            description,
            tools,
            link,
            imagePath: cleanedPath || 'assets/images/placeholder.jpg'
        };

        showLoading(true, "Saving project details...");

        const projectsCollection = db.collection('students').doc(STUDENT_ID).collection('projects');
        const savePromise = projectId 
            ? projectsCollection.doc(projectId).set(projectData, { merge: true })
            : projectsCollection.add(projectData);

        savePromise.then(() => {
            showLoading(false);
            resetProjectForm();
            loadProjects();
            showToast("Project saved successfully!");
        }).catch(error => {
            showLoading(false);
            showToast("Failed to save project: " + error.message, "error");
        });
    });

    function attachProjectsEvents() {
        // Edit project
        document.querySelectorAll('.edit-project-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const title = btn.getAttribute('data-title');
                const description = btn.getAttribute('data-description');
                const tools = btn.getAttribute('data-tools');
                const link = btn.getAttribute('data-link');
                const imgPath = btn.getAttribute('data-path');

                document.getElementById('editProjectId').value = id;
                document.getElementById('projectTitle').value = title;
                document.getElementById('projectDescription').value = description;
                document.getElementById('projectTools').value = tools;
                document.getElementById('projectLink').value = link;
                projectImagePath.value = imgPath;

                if (imgPath) {
                    projectThumbnail.src = getImagePath(imgPath);
                    projectThumbnailBox.style.display = 'block';
                } else {
                    projectThumbnailBox.style.display = 'none';
                }

                document.getElementById('projectFormTitle').textContent = "Edit Project Case Study";
                document.getElementById('saveProjectBtn').textContent = "Update Project";
                cancelProjectEditBtn.style.display = 'inline-flex';
            });
        });

        // Delete project trigger
        document.querySelectorAll('.delete-project-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                pendingDeleteId = btn.getAttribute('data-id');
                pendingDeleteType = 'project';
                document.getElementById('deleteModal').classList.add('active');
            });
        });
    }

    cancelProjectEditBtn.addEventListener('click', resetProjectForm);

    function resetProjectForm() {
        document.getElementById('editProjectId').value = '';
        document.getElementById('projectTitle').value = '';
        document.getElementById('projectDescription').value = '';
        document.getElementById('projectTools').value = '';
        document.getElementById('projectLink').value = '';
        projectImagePath.value = '';
        projectThumbnailBox.style.display = 'none';
        projectThumbnail.src = '';

        document.getElementById('projectFormTitle').textContent = "Add New Project";
        document.getElementById('saveProjectBtn').textContent = "Add Project";
        cancelProjectEditBtn.style.display = 'none';
    }


    // ==========================================
    // CERTIFICATIONS LOGIC (CRUD & FILE PATHS)
    // ==========================================
    const certForm = document.getElementById('certForm');
    const certFilePath = document.getElementById('certFilePath');
    const certsTableBody = document.getElementById('certsTableBody');
    const cancelCertEditBtn = document.getElementById('cancelCertEditBtn');

    // Load certifications
    function loadCertifications() {
        db.collection('students').doc(STUDENT_ID).collection('certificates')
            .get()
            .then(snapshot => {
                certsTableBody.innerHTML = '';
                
                if (snapshot.empty) {
                    certsTableBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No certificates found. Add one from the form.</td></tr>';
                    return;
                }

                snapshot.forEach(doc => {
                    const cert = doc.data();
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>
                            <strong>${cert.name}</strong><br>
                            <span style="font-size: 0.8rem; color: var(--admin-color-text-muted)">${cert.issuedBy || ''}</span>
                        </td>
                        <td><span style="font-size: 0.85rem">${cert.date || ''}</span></td>
                        <td>
                            <div class="actions-cell-wrapper">
                                <button class="btn-admin btn-admin-secondary btn-icon-only edit-cert-btn" 
                                    data-id="${doc.id}" 
                                    data-name="${cert.name}" 
                                    data-issuer="${cert.issuedBy || ''}" 
                                    data-date="${cert.date || ''}" 
                                    data-link="${cert.link || ''}" 
                                    data-path="${cert.filePath || ''}" 
                                    title="Edit Certificate">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="btn-admin btn-admin-danger btn-icon-only delete-cert-btn" data-id="${doc.id}" title="Delete Certificate">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    certsTableBody.appendChild(tr);
                });

                attachCertsEvents();
            });
    }

    // Save certification
    certForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const certId = document.getElementById('editCertId').value;
        const name = document.getElementById('certName').value.trim();
        const issuedBy = document.getElementById('certIssuer').value.trim();
        const date = document.getElementById('certDate').value.trim();
        const link = document.getElementById('certLink').value.trim();
        const rawPath = certFilePath.value;

        if (!name || !issuedBy || !date) return;

        const cleanedPath = cleanAssetPath(rawPath);

        const certData = {
            name,
            issuedBy,
            date,
            link,
            filePath: cleanedPath
        };

        showLoading(true, "Saving certificate credentials...");
        
        const certsCollection = db.collection('students').doc(STUDENT_ID).collection('certificates');
        const savePromise = certId 
            ? certsCollection.doc(certId).set(certData, { merge: true })
            : certsCollection.add(certData);

        savePromise.then(() => {
            showLoading(false);
            resetCertForm();
            loadCertifications();
            showToast("Certificate saved successfully!");
        }).catch(error => {
            showLoading(false);
            showToast("Failed to save credentials: " + error.message, "error");
        });
    });

    function attachCertsEvents() {
        // Edit cert
        document.querySelectorAll('.edit-cert-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const name = btn.getAttribute('data-name');
                const issuer = btn.getAttribute('data-issuer');
                const date = btn.getAttribute('data-date');
                const link = btn.getAttribute('data-link');
                const path = btn.getAttribute('data-path');

                document.getElementById('editCertId').value = id;
                document.getElementById('certName').value = name;
                document.getElementById('certIssuer').value = issuer;
                document.getElementById('certDate').value = date;
                document.getElementById('certLink').value = link;
                certFilePath.value = path;

                document.getElementById('certFormTitle').textContent = "Edit Certificate Details";
                document.getElementById('saveCertBtn').textContent = "Update Cert";
                cancelCertEditBtn.style.display = 'inline-flex';
            });
        });

        // Delete cert trigger
        document.querySelectorAll('.delete-cert-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                pendingDeleteId = btn.getAttribute('data-id');
                pendingDeleteType = 'cert';
                document.getElementById('deleteModal').classList.add('active');
            });
        });
    }

    cancelCertEditBtn.addEventListener('click', resetCertForm);

    function resetCertForm() {
        document.getElementById('editCertId').value = '';
        document.getElementById('certName').value = '';
        document.getElementById('certIssuer').value = '';
        document.getElementById('certDate').value = '';
        document.getElementById('certLink').value = '';
        certFilePath.value = '';

        document.getElementById('certFormTitle').textContent = "Add Certificate";
        document.getElementById('saveCertBtn').textContent = "Add Certificate";
        cancelCertEditBtn.style.display = 'none';
    }


    // ==========================================
    // CV FILE PATHS MANAGEMENT
    // ==========================================
    const cvForm = document.getElementById('cvForm');
    const cvPathInput = document.getElementById('cvPath');

    cvForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawPath = cvPathInput.value;
        const cleanedPath = cleanAssetPath(rawPath);

        if (!cleanedPath) return;

        // Validation check: Only warn user if not ending with PDF, but allow saving
        if (!isPdf(cleanedPath)) {
            showToast("Warning: Resume file path does not end with .pdf", "info");
        }

        showLoading(true, "Saving CV path details...");

        db.collection('students').doc(STUDENT_ID).set({
            cvPath: cleanedPath
        }, { merge: true }).then(() => {
            showLoading(false);
            updateCvStatusUI(cleanedPath);
            showToast("CV document link path updated!");
        }).catch(error => {
            showLoading(false);
            showToast("Failed to save CV path: " + error.message, "error");
        });
    });


    // ==========================================
    // SOCIAL LINKS & CONTACT DETAILS LOGIC
    // ==========================================
    const socialsForm = document.getElementById('socialsForm');

    socialsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showLoading(true, "Updating socials & contact parameters...");

        const email = document.getElementById('contactEmail').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const whatsapp = document.getElementById('contactWhatsapp').value.trim();
        const location = document.getElementById('contactAddress').value.trim();

        const facebook = document.getElementById('socialFacebook').value.trim();
        const instagram = document.getElementById('socialInstagram').value.trim();
        const linkedin = document.getElementById('socialLinkedin').value.trim();
        const tiktok = document.getElementById('socialTiktok').value.trim();
        const youtube = document.getElementById('socialYoutube').value.trim();
        const github = document.getElementById('socialGithub').value.trim();

        const updatedData = {
            email,
            phone,
            whatsapp,
            location,
            socials: {
                facebook,
                instagram,
                linkedin,
                tiktok,
                youtube,
                github,
                whatsapp
            }
        };

        db.collection('students').doc(STUDENT_ID).set(updatedData, { merge: true })
            .then(() => {
                showLoading(false);
                showToast("Social links and contact credentials saved!");
            })
            .catch(error => {
                showLoading(false);
                showToast("Failed to save credentials: " + error.message, "error");
            });
    });


    // ==========================================
    // DELETE CONFIRMATION DIALOG MANAGER
    // ==========================================
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.remove('active');
        pendingDeleteId = null;
        pendingDeleteType = null;
    });

    confirmDeleteBtn.addEventListener('click', () => {
        if (!pendingDeleteId || !pendingDeleteType) return;
        
        deleteModal.classList.remove('active');
        showLoading(true, "Deleting record...");

        const studentDoc = db.collection('students').doc(STUDENT_ID);
        let deletePromise;

        if (pendingDeleteType === 'skill') {
            deletePromise = studentDoc.collection('skills').doc(pendingDeleteId).delete();
        } else if (pendingDeleteType === 'project') {
            deletePromise = studentDoc.collection('projects').doc(pendingDeleteId).delete();
        } else if (pendingDeleteType === 'cert') {
            deletePromise = studentDoc.collection('certificates').doc(pendingDeleteId).delete();
        } else if (pendingDeleteType === 'experience') {
            deletePromise = studentDoc.collection('experience').doc(pendingDeleteId).delete();
        } else if (pendingDeleteType === 'testimonial') {
            deletePromise = studentDoc.collection('testimonials').doc(pendingDeleteId).delete();
        }

        deletePromise.then(() => {
            showLoading(false);
            showToast("Item deleted successfully.");
            
            // Reload target subcollection lists
            if (pendingDeleteType === 'skill') {
                resetSkillForm();
                loadSkills();
            } else if (pendingDeleteType === 'project') {
                resetProjectForm();
                loadProjects();
            } else if (pendingDeleteType === 'cert') {
                resetCertForm();
                loadCertifications();
            } else if (pendingDeleteType === 'experience') {
                resetExperienceForm();
                loadExperience();
            } else if (pendingDeleteType === 'testimonial') {
                resetTestimonialForm();
                loadTestimonials();
            }

            pendingDeleteId = null;
            pendingDeleteType = null;
        }).catch(error => {
            showLoading(false);
            showToast("Failed to delete: " + error.message, "error");
            
            pendingDeleteId = null;
            pendingDeleteType = null;
        });
    });


    // ==========================================
    // UTILITY HELPER FUNCS (TOAST & LOAD SPINNER)
    // ==========================================
    
    // Toast Creator
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconHtml = '<i class="fa-solid fa-circle-check"></i>';
        if (type === 'error') {
            iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';
        } else if (type === 'info') {
            iconHtml = '<i class="fa-solid fa-circle-info"></i>';
        }

        toast.innerHTML = `
            ${iconHtml}
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove element from DOM after fading animation finishes
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    // ==========================================
    // EXPERIENCE LOGIC (CRUD)
    // ==========================================
    const experienceForm = document.getElementById('experienceForm');
    const experienceTableBody = document.getElementById('experienceTableBody');
    const cancelExperienceEditBtn = document.getElementById('cancelExperienceEditBtn');

    function loadExperience() {
        db.collection('students').doc(STUDENT_ID).collection('experience')
            .get()
            .then(snapshot => {
                experienceTableBody.innerHTML = '';
                
                if (snapshot.empty) {
                    experienceTableBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No experience history found. Add some records.</td></tr>';
                    return;
                }

                snapshot.forEach(doc => {
                    const exp = doc.data();
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>
                            <strong>${exp.role}</strong><br>
                            <span style="font-size: 0.8rem; color: var(--admin-color-text-muted)">${exp.company}</span>
                        </td>
                        <td><span style="font-size: 0.85rem">${exp.duration}</span></td>
                        <td>
                            <div class="actions-cell-wrapper">
                                <button class="btn-admin btn-admin-secondary btn-icon-only edit-experience-btn" 
                                    data-id="${doc.id}" 
                                    data-role="${exp.role}" 
                                    data-company="${exp.company}" 
                                    data-duration="${exp.duration}" 
                                    data-description="${exp.description}" 
                                    title="Edit Experience">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="btn-admin btn-admin-danger btn-icon-only delete-experience-btn" data-id="${doc.id}" title="Delete Experience">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    experienceTableBody.appendChild(tr);
                });

                attachExperienceEvents();
            });
    }

    experienceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const expId = document.getElementById('editExperienceId').value;
        const role = document.getElementById('experienceRole').value.trim();
        const company = document.getElementById('experienceCompany').value.trim();
        const duration = document.getElementById('experienceDuration').value.trim();
        const description = document.getElementById('experienceDescription').value.trim();

        if (!role || !company || !duration || !description) return;

        showLoading(true, "Saving experience details...");

        const expData = { role, company, duration, description };
        const expCollection = db.collection('students').doc(STUDENT_ID).collection('experience');

        const savePromise = expId 
            ? expCollection.doc(expId).update(expData)
            : expCollection.add(expData);

        savePromise.then(() => {
            showLoading(false);
            resetExperienceForm();
            loadExperience();
            showToast("Experience record saved!");
        }).catch(error => {
            showLoading(false);
            showToast("Failed to save experience: " + error.message, "error");
        });
    });

    function attachExperienceEvents() {
        document.querySelectorAll('.edit-experience-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const role = btn.getAttribute('data-role');
                const company = btn.getAttribute('data-company');
                const duration = btn.getAttribute('data-duration');
                const description = btn.getAttribute('data-description');

                document.getElementById('editExperienceId').value = id;
                document.getElementById('experienceRole').value = role;
                document.getElementById('experienceCompany').value = company;
                document.getElementById('experienceDuration').value = duration;
                document.getElementById('experienceDescription').value = description;

                document.getElementById('experienceFormTitle').textContent = "Edit Experience Record";
                document.getElementById('saveExperienceBtn').textContent = "Update Experience";
                cancelExperienceEditBtn.style.display = 'inline-flex';
            });
        });

        document.querySelectorAll('.delete-experience-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                pendingDeleteId = btn.getAttribute('data-id');
                pendingDeleteType = 'experience';
                document.getElementById('deleteModal').classList.add('active');
            });
        });
    }

    cancelExperienceEditBtn.addEventListener('click', resetExperienceForm);

    function resetExperienceForm() {
        document.getElementById('editExperienceId').value = '';
        document.getElementById('experienceRole').value = '';
        document.getElementById('experienceCompany').value = '';
        document.getElementById('experienceDuration').value = '';
        document.getElementById('experienceDescription').value = '';
        
        document.getElementById('experienceFormTitle').textContent = "Add New Experience";
        document.getElementById('saveExperienceBtn').textContent = "Add Experience";
        cancelExperienceEditBtn.style.display = 'none';
    }


    // ==========================================
    // TESTIMONIALS LOGIC (CRUD)
    // ==========================================
    const testimonialForm = document.getElementById('testimonialForm');
    const testimonialTableBody = document.getElementById('testimonialTableBody');
    const cancelTestimonialEditBtn = document.getElementById('cancelTestimonialEditBtn');

    function loadTestimonials() {
        db.collection('students').doc(STUDENT_ID).collection('testimonials')
            .get()
            .then(snapshot => {
                testimonialTableBody.innerHTML = '';
                
                if (snapshot.empty) {
                    testimonialTableBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No testimonials found. Add some feedback.</td></tr>';
                    return;
                }

                snapshot.forEach(doc => {
                    const t = doc.data();
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>
                            <strong>${t.name}</strong><br>
                            <span style="font-size: 0.8rem; color: var(--admin-color-text-muted)">${t.role}</span>
                        </td>
                        <td><span style="font-size: 0.85rem; max-width: 200px; display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.text}</span></td>
                        <td>
                            <div class="actions-cell-wrapper">
                                <button class="btn-admin btn-admin-secondary btn-icon-only edit-testimonial-btn" 
                                    data-id="${doc.id}" 
                                    data-name="${t.name}" 
                                    data-role="${t.role}" 
                                    data-text="${t.text}" 
                                    title="Edit Testimonial">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="btn-admin btn-admin-danger btn-icon-only delete-testimonial-btn" data-id="${doc.id}" title="Delete Testimonial">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    testimonialTableBody.appendChild(tr);
                });

                attachTestimonialsEvents();
            });
    }

    testimonialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const testId = document.getElementById('editTestimonialId').value;
        const name = document.getElementById('testimonialName').value.trim();
        const role = document.getElementById('testimonialRole').value.trim();
        const text = document.getElementById('testimonialText').value.trim();

        if (!name || !role || !text) return;

        showLoading(true, "Saving testimonial feedback...");

        const testData = { name, role, text };
        const testCollection = db.collection('students').doc(STUDENT_ID).collection('testimonials');

        const savePromise = testId 
            ? testCollection.doc(testId).update(testData)
            : testCollection.add(testData);

        savePromise.then(() => {
            showLoading(false);
            resetTestimonialForm();
            loadTestimonials();
            showToast("Testimonial saved successfully!");
        }).catch(error => {
            showLoading(false);
            showToast("Failed to save testimonial: " + error.message, "error");
        });
    });

    function attachTestimonialsEvents() {
        document.querySelectorAll('.edit-testimonial-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const name = btn.getAttribute('data-name');
                const role = btn.getAttribute('data-role');
                const text = btn.getAttribute('data-text');

                document.getElementById('editTestimonialId').value = id;
                document.getElementById('testimonialName').value = name;
                document.getElementById('testimonialRole').value = role;
                document.getElementById('testimonialText').value = text;

                document.getElementById('testimonialFormTitle').textContent = "Edit Testimonial Quote";
                document.getElementById('saveTestimonialBtn').textContent = "Update Testimonial";
                cancelTestimonialEditBtn.style.display = 'inline-flex';
            });
        });

        document.querySelectorAll('.delete-testimonial-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                pendingDeleteId = btn.getAttribute('data-id');
                pendingDeleteType = 'testimonial';
                document.getElementById('deleteModal').classList.add('active');
            });
        });
    }

    cancelTestimonialEditBtn.addEventListener('click', resetTestimonialForm);

    function resetTestimonialForm() {
        document.getElementById('editTestimonialId').value = '';
        document.getElementById('testimonialName').value = '';
        document.getElementById('testimonialRole').value = '';
        document.getElementById('testimonialText').value = '';
        
        document.getElementById('testimonialFormTitle').textContent = "Add Testimonial";
        document.getElementById('saveTestimonialBtn').textContent = "Add Testimonial";
        cancelTestimonialEditBtn.style.display = 'none';
    }


    // ==========================================
    // PORTFOLIO DESIGN TEMPLATES LOGIC
    // ==========================================
    
    function loadSelectedTemplate() {
        db.collection('students').doc(STUDENT_ID).get()
            .then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    const selected = (data.profile && data.profile.selectedTemplate) || data.selectedTemplate || "template-modern";
                    renderTemplateOptions(selected);
                } else {
                    renderTemplateOptions("template-modern");
                }
            }).catch(error => {
                console.error("Error loading selected template: ", error);
                renderTemplateOptions("template-modern");
            });
    }

    function renderTemplateOptions(selectedTemplate) {
        const cards = document.querySelectorAll('.template-choice-card');
        cards.forEach(card => {
            const templateName = card.getAttribute('data-template');
            if (templateName === selectedTemplate) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    function saveSelectedTemplate(templateName) {
        showLoading(true, "Updating portfolio layout...");
        db.collection('students').doc(STUDENT_ID).set({
            profile: {
                selectedTemplate: templateName
            }
        }, { merge: true }).then(() => {
            showLoading(false);
            renderTemplateOptions(templateName);
            showToast("Design template updated successfully!");
        }).catch(error => {
            showLoading(false);
            showToast("Failed to update template: " + error.message, "error");
        });
    }

    // Attach click events to design selection buttons
    document.querySelectorAll('.btn-select-template').forEach(btn => {
        btn.addEventListener('click', () => {
            const templateName = btn.getAttribute('data-template');
            saveSelectedTemplate(templateName);
        });
    });


    // Toggle global loader
    function showLoading(show, message = "Loading...") {
        const loader = document.getElementById('globalLoading');
        const text = loader.querySelector('p');
        
        text.textContent = message;
        if (show) {
            loader.classList.add('active');
        } else {
            loader.classList.remove('active');
        }
    }

});
