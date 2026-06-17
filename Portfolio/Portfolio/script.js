/**
 * Digital Marketing Student Portfolio - Main JavaScript
 * 
 * Manages:
 * 1. Firebase Firestore data fetching & UI injection
 * 2. Fallback offline mockup rendering
 * 3. Dynamic template rendering based on selectedTemplate
 * 4. Light/Dark mode state management & localStorage
 * 5. Custom scroll reveal intersection observer
 * 6. Section highlight navigation intersection observer
 * 7. Mobile burger navigation toggle
 * 8. Real-time form validators & Success popup triggers
 * 9. Project modal binders (triggered post-render)
 */

// ==========================================
// PATH & STRING HELPER FUNCTIONS
// ==========================================

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

function getSafeText(value, fallback) {
    if (value === undefined || value === null || value === '') {
        return fallback || '';
    }
    return value;
}

// ==========================================
// DATA RENDERING HELPERS
// ==========================================

function renderSocialLinks(socials) {
    if (!socials) return "";
    let html = "";
    if (socials.linkedin) {
        html += `<a href="${socials.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>`;
    }
    if (socials.instagram) {
        html += `<a href="${socials.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>`;
    }
    if (socials.facebook) {
        html += `<a href="${socials.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>`;
    }
    if (socials.github) {
        html += `<a href="${socials.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>`;
    }
    if (socials.whatsapp) {
        const cleanWhatsapp = socials.whatsapp.replace(/[^0-9]/g, '');
        html += `<a href="https://wa.me/${cleanWhatsapp}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>`;
    }
    return html;
}

function getIconForSkill(name) {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('seo') || lowercaseName.includes('search engine')) {
        return 'fa-solid fa-magnifying-glass-chart';
    }
    if (lowercaseName.includes('social') || lowercaseName.includes('instagram') || lowercaseName.includes('tiktok') || lowercaseName.includes('smm')) {
        return 'fa-brands fa-instagram';
    }
    if (lowercaseName.includes('content') || lowercaseName.includes('copywrite') || lowercaseName.includes('blog')) {
        return 'fa-solid fa-pen-nib';
    }
    if (lowercaseName.includes('facebook') || lowercaseName.includes('meta')) {
        return 'fa-brands fa-facebook';
    }
    if (lowercaseName.includes('google ads') || lowercaseName.includes('ppc') || lowercaseName.includes('adwords')) {
        return 'fa-brands fa-google';
    }
    if (lowercaseName.includes('email') || lowercaseName.includes('newsletter') || lowercaseName.includes('mailchimp')) {
        return 'fa-solid fa-envelope-open-text';
    }
    if (lowercaseName.includes('canva') || lowercaseName.includes('design') || lowercaseName.includes('graphics')) {
        return 'fa-solid fa-palette';
    }
    if (lowercaseName.includes('analytics') || lowercaseName.includes('ga4') || lowercaseName.includes('report') || lowercaseName.includes('excel')) {
        return 'fa-solid fa-chart-line';
    }
    return 'fa-solid fa-check-double';
}

function renderSkills(skills, templateType) {
    if (!skills || skills.length === 0) return "<p class='no-data-msg'>No skills added yet.</p>";
    
    return skills.map(skill => {
        const iconClass = getIconForSkill(skill.name);
        const level = skill.level || 0;
        
        if (templateType === "template-modern") {
            return `
                <div class="skill-card scroll-reveal">
                    <div class="skill-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <h3>${skill.name}</h3>
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar-fill" style="width: ${level}%"></div>
                    </div>
                    <span class="skill-percentage">Proficiency: ${level}%</span>
                </div>
            `;
        } else if (templateType === "template-minimal") {
            return `
                <div class="minimal-skill-item">
                    <div class="minimal-skill-info">
                        <span class="minimal-skill-name">${skill.name}</span>
                        <span class="minimal-skill-level">${level}%</span>
                    </div>
                    <div class="minimal-skill-bar">
                        <div class="minimal-skill-bar-fill" style="width: ${level}%"></div>
                    </div>
                </div>
            `;
        } else if (templateType === "template-dark") {
            return `
                <div class="dark-neon-skill-card scroll-reveal">
                    <div class="dark-neon-skill-info">
                        <span class="skill-name-with-icon"><i class="${iconClass}"></i> ${skill.name}</span>
                        <span class="neon-percentage-label">${level}%</span>
                    </div>
                    <div class="neon-progress-bar">
                        <div class="neon-progress-bar-fill" style="width: ${level}%"></div>
                    </div>
                </div>
            `;
        } else if (templateType === "template-creative") {
            return `
                <div class="creative-skill-sticker scroll-reveal">
                    <i class="${iconClass}"></i>
                    <span>${skill.name}</span>
                    <span class="creative-skill-level-badge">${level}%</span>
                </div>
            `;
        } else if (templateType === "template-corporate") {
            return `
                <div class="corporate-skill-item">
                    <div class="corporate-skill-meta">
                        <strong>${skill.name}</strong>
                        <span>${level}%</span>
                    </div>
                    <div class="corporate-progress-track">
                        <div class="corporate-progress-bar" style="width: ${level}%"></div>
                    </div>
                </div>
            `;
        } else if (templateType === "template-personal-brand") {
            return `
                <div class="personal-skill-badge scroll-reveal">
                    <i class="${iconClass}"></i>
                    <span>${skill.name}</span>
                </div>
            `;
        } else if (templateType === "template-marketing-resume") {
            return `
                <div class="resume-skill-item">
                    <span class="resume-skill-name">${skill.name}</span>
                    <div class="resume-skill-bar-bg">
                        <div class="resume-skill-bar-fill" style="width: ${level}%"></div>
                    </div>
                </div>
            `;
        } else if (templateType === "template-portfolio-grid") {
            return `
                <div class="grid-skill-chip scroll-reveal">
                    <i class="${iconClass}"></i>
                    <span>${skill.name}</span>
                </div>
            `;
        } else if (templateType === "template-seo-specialist") {
            return `
                <div class="seo-skill-card scroll-reveal">
                    <div class="seo-skill-header">
                        <span>${skill.name}</span>
                        <strong>${level}%</strong>
                    </div>
                    <div class="seo-skill-gauge">
                        <div class="seo-skill-gauge-fill" style="width: ${level}%"></div>
                    </div>
                </div>
            `;
        } else if (templateType === "template-social-creator") {
            return `
                <div class="social-skill-chip scroll-reveal">
                    <i class="${iconClass}"></i>
                    <span>${skill.name} (${level}%)</span>
                </div>
            `;
        } else {
            return `
                <div class="skill-card">
                    <div class="skill-icon"><i class="${iconClass}"></i></div>
                    <h3>${skill.name}</h3>
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar-fill" style="width: ${level}%"></div>
                    </div>
                    <span>Proficiency: ${level}%</span>
                </div>
            `;
        }
    }).join("");
}

function renderProjects(projects, templateType) {
    if (!projects || projects.length === 0) return "<p class='no-data-msg'>No campaigns or projects added yet.</p>";
    
    return projects.map((project, index) => {
        const toolsBadges = (project.tools || '').split(',')
            .filter(t => t.trim() !== '')
            .map(t => `<span>${t.trim()}</span>`)
            .join(' ');
        
        const imgUrl = getImagePath(project.imagePath || project.imageUrl);
        const projectId = project.id;
        const desc = getSafeText(project.description, "");
        const shortDesc = desc.length > 120 ? desc.substring(0, 120) + "..." : desc;
        
        if (templateType === "template-modern") {
            return `
                <div class="project-card scroll-reveal">
                    <div class="project-img-wrapper">
                        <img src="${imgUrl}" alt="${project.title}" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                    </div>
                    <div class="project-info">
                        <span class="project-category">Campaign Case Study</span>
                        <h3>${project.title}</h3>
                        <p>${shortDesc}</p>
                        <div class="project-tools">
                            ${toolsBadges}
                        </div>
                        <button class="btn btn-outline modal-trigger" data-target="modal-project-${projectId}">View Project Details</button>
                    </div>
                </div>
            `;
        } else if (templateType === "template-minimal") {
            return `
                <div class="minimal-project-item">
                    <div class="minimal-project-header">
                        <div>
                            <h3 class="minimal-project-title">${project.title}</h3>
                            <div class="minimal-project-tools">${toolsBadges}</div>
                        </div>
                        <button class="minimal-project-link-btn modal-trigger" data-target="modal-project-${projectId}">Read Case Study &rarr;</button>
                    </div>
                    <p class="minimal-project-desc">${shortDesc}</p>
                </div>
            `;
        } else if (templateType === "template-dark") {
            return `
                <div class="neon-horizontal-project scroll-reveal">
                    <div class="neon-project-img">
                        <img src="${imgUrl}" alt="${project.title}" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                    </div>
                    <div class="neon-project-details">
                        <span class="neon-project-tag">Featured Project</span>
                        <h3>${project.title}</h3>
                        <p>${shortDesc}</p>
                        <div class="neon-project-tools">
                            ${toolsBadges}
                        </div>
                        <button class="btn neon-glow-btn modal-trigger" data-target="modal-project-${projectId}">View Case Study</button>
                    </div>
                </div>
            `;
        } else if (templateType === "template-creative") {
            const sizeClass = (index % 3 === 0) ? "creative-card-large" : "creative-card-standard";
            return `
                <div class="creative-project-card ${sizeClass} scroll-reveal">
                    <div class="creative-project-image">
                        <img src="${imgUrl}" alt="${project.title}" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                    </div>
                    <div class="creative-project-body">
                        <h3>${project.title}</h3>
                        <div class="creative-project-tags">
                            ${toolsBadges}
                        </div>
                        <button class="creative-project-btn modal-trigger" data-target="modal-project-${projectId}">See Details</button>
                    </div>
                </div>
            `;
        } else if (templateType === "template-corporate") {
            return `
                <div class="corporate-project-row">
                    <div class="corporate-project-thumb">
                        <img src="${imgUrl}" alt="${project.title}" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                    </div>
                    <div class="corporate-project-content">
                        <h3>${project.title}</h3>
                        <p>${shortDesc}</p>
                        <div class="corporate-project-meta">
                            <div class="corporate-project-tags">${toolsBadges}</div>
                            <button class="corporate-details-btn modal-trigger" data-target="modal-project-${projectId}"><i class="fa-solid fa-circle-info"></i> View Details</button>
                        </div>
                    </div>
                </div>
            `;
        } else if (templateType === "template-personal-brand") {
            return `
                <div class="personal-project-card scroll-reveal">
                    <div class="personal-project-img-container">
                        <img src="${imgUrl}" alt="${project.title}" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                    </div>
                    <div class="personal-project-content">
                        <h3>${project.title}</h3>
                        <p>${shortDesc}</p>
                        <div class="personal-project-tags">${toolsBadges}</div>
                        <button class="personal-project-btn modal-trigger" data-target="modal-project-${projectId}">View Case Study <i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>
            `;
        } else if (templateType === "template-marketing-resume") {
            return `
                <div class="resume-project-item">
                    <div class="resume-project-head">
                        <h4>${project.title}</h4>
                        <button class="resume-project-modal-btn modal-trigger" data-target="modal-project-${projectId}"><i class="fa-solid fa-up-right-from-square"></i> Details</button>
                    </div>
                    <p class="resume-project-desc">${shortDesc}</p>
                    <div class="resume-project-tools">${toolsBadges}</div>
                </div>
            `;
        } else if (templateType === "template-portfolio-grid") {
            return `
                <div class="grid-project-card scroll-reveal modal-trigger" data-target="modal-project-${projectId}">
                    <img src="${imgUrl}" alt="${project.title}" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                    <div class="grid-project-overlay">
                        <h3>${project.title}</h3>
                        <p>Click to open details</p>
                    </div>
                </div>
            `;
        } else if (templateType === "template-seo-specialist") {
            return `
                <div class="seo-audit-card scroll-reveal">
                    <div class="seo-audit-header">
                        <span class="seo-audit-label"><i class="fa-solid fa-chart-line"></i> Audit Case</span>
                        <h3>${project.title}</h3>
                    </div>
                    <p>${shortDesc}</p>
                    <div class="seo-audit-tools">${toolsBadges}</div>
                    <button class="seo-audit-btn modal-trigger" data-target="modal-project-${projectId}">Analyze Case Data &rarr;</button>
                </div>
            `;
        } else if (templateType === "template-social-creator") {
            return `
                <div class="social-post-card scroll-reveal">
                    <div class="social-post-top">
                        <div class="social-post-user-dot"></div>
                        <span>Campaign Post</span>
                    </div>
                    <div class="social-post-img">
                        <img src="${imgUrl}" alt="${project.title}" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                    </div>
                    <div class="social-post-actions">
                        <div class="social-post-icons">
                            <i class="fa-regular fa-heart"></i>
                            <i class="fa-regular fa-comment"></i>
                            <i class="fa-regular fa-paper-plane"></i>
                        </div>
                        <button class="social-post-view-btn modal-trigger" data-target="modal-project-${projectId}">See Details</button>
                    </div>
                    <div class="social-post-caption">
                        <strong>${project.title}</strong>
                        <p>${shortDesc}</p>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="project-card">
                    <h3>${project.title}</h3>
                    <p>${shortDesc}</p>
                    <button class="btn btn-outline modal-trigger" data-target="modal-project-${projectId}">View Details</button>
                </div>
            `;
        }
    }).join("");
}

function renderCertificates(certificates, templateType) {
    if (!certificates || certificates.length === 0) return "<p class='no-data-msg'>No certifications added yet.</p>";
    
    return certificates.map(cert => {
        const cleanPath = cleanAssetPath(cert.filePath || cert.fileUrl);
        let certUrl = '#';
        let linkText = 'Verify';
        
        if (cleanPath) {
            certUrl = cleanPath;
            linkText = isPdf(cleanPath) ? 'View PDF' : 'View Certificate';
        } else if (cert.link) {
            certUrl = cert.link;
            linkText = 'Verify Credential';
        }
        
        const targetAttr = certUrl !== '#' ? 'target="_blank" rel="noopener noreferrer"' : '';
        const issuedBy = cert.issuedBy || 'Google';
        
        if (templateType === "template-modern") {
            return `
                <div class="cert-card scroll-reveal">
                    <div class="cert-icon-box">
                        <i class="fa-solid fa-medal"></i>
                    </div>
                    <div class="cert-details">
                        <h3>${cert.name}</h3>
                        <p class="cert-issuer">${issuedBy}</p>
                        <p class="cert-date">${cert.date || ''}</p>
                        <a href="${certUrl}" ${targetAttr} class="cert-link">${linkText} <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                    </div>
                </div>
            `;
        } else if (templateType === "template-minimal") {
            return `
                <div class="minimal-cert-item">
                    <div class="minimal-cert-info">
                        <strong>${cert.name}</strong>
                        <span class="minimal-cert-issuer">${issuedBy} (${cert.date || ''})</span>
                    </div>
                    ${certUrl !== '#' ? `<a href="${certUrl}" ${targetAttr} class="minimal-cert-link"><i class="fa-solid fa-link"></i></a>` : ''}
                </div>
            `;
        } else if (templateType === "template-dark") {
            return `
                <div class="neon-cert-badge scroll-reveal">
                    <div class="neon-badge-glow"></div>
                    <i class="fa-solid fa-shield-halved badge-icon"></i>
                    <h4>${cert.name}</h4>
                    <p>${issuedBy}</p>
                    ${certUrl !== '#' ? `<a href="${certUrl}" ${targetAttr} class="neon-badge-link">Verify <i class="fa-solid fa-circle-chevron-right"></i></a>` : ''}
                </div>
            `;
        } else if (templateType === "template-creative") {
            return `
                <div class="creative-cert-slide scroll-reveal">
                    <div class="creative-cert-corner"></div>
                    <h3>${cert.name}</h3>
                    <p class="creative-issuer">${issuedBy}</p>
                    <span class="creative-date">${cert.date || ''}</span>
                    <a href="${certUrl}" ${targetAttr} class="creative-cert-btn">${linkText}</a>
                </div>
            `;
        } else if (templateType === "template-corporate") {
            return `
                <div class="corporate-cert-card">
                    <div class="corporate-cert-header">
                        <i class="fa-solid fa-award"></i>
                        <div>
                            <h4>${cert.name}</h4>
                            <p>${issuedBy}</p>
                        </div>
                    </div>
                    <div class="corporate-cert-footer">
                        <span>${cert.date || ''}</span>
                        <a href="${certUrl}" ${targetAttr} class="corporate-cert-btn">Verify Credential</a>
                    </div>
                </div>
            `;
        } else if (templateType === "template-personal-brand") {
            return `
                <div class="personal-cert-item scroll-reveal">
                    <div class="personal-cert-dot"></div>
                    <div class="personal-cert-info">
                        <h4>${cert.name}</h4>
                        <span>${issuedBy} &bull; ${cert.date || ''}</span>
                    </div>
                    ${certUrl !== '#' ? `<a href="${certUrl}" ${targetAttr} class="personal-cert-link"><i class="fa-solid fa-link"></i></a>` : ''}
                </div>
            `;
        } else if (templateType === "template-marketing-resume") {
            return `
                <div class="resume-cert-item">
                    <div class="resume-cert-meta">
                        <strong>${cert.name}</strong>
                        <span>${issuedBy} (${cert.date || ''})</span>
                    </div>
                    ${certUrl !== '#' ? `<a href="${certUrl}" ${targetAttr} class="resume-cert-link">Verify &rarr;</a>` : ''}
                </div>
            `;
        } else if (templateType === "template-portfolio-grid") {
            return `
                <div class="grid-cert-card scroll-reveal">
                    <i class="fa-solid fa-certificate"></i>
                    <h4>${cert.name}</h4>
                    <p>${issuedBy}</p>
                    ${certUrl !== '#' ? `<a href="${certUrl}" ${targetAttr} class="grid-cert-btn">View Credential</a>` : ''}
                </div>
            `;
        } else if (templateType === "template-seo-specialist") {
            return `
                <div class="seo-trust-badge scroll-reveal">
                    <div class="seo-trust-icon"><i class="fa-solid fa-award"></i></div>
                    <div class="seo-trust-info">
                        <h4>${cert.name}</h4>
                        <p>Issued by ${issuedBy} &bull; ${cert.date || ''}</p>
                    </div>
                    ${certUrl !== '#' ? `<a href="${certUrl}" ${targetAttr} class="seo-trust-btn">Verify Badge</a>` : ''}
                </div>
            `;
        } else if (templateType === "template-social-creator") {
            return `
                <div class="social-story-card scroll-reveal">
                    <div class="social-story-bubble">
                        <i class="fa-solid fa-bookmark"></i>
                    </div>
                    <h4>${cert.name}</h4>
                    <p>${issuedBy}</p>
                    ${certUrl !== '#' ? `<a href="${certUrl}" ${targetAttr} class="social-story-link">View Story</a>` : ''}
                </div>
            `;
        } else {
            return `
                <div class="cert-card">
                    <h3>${cert.name}</h3>
                    <p>${issuedBy}</p>
                    <a href="${certUrl}" ${targetAttr}>${linkText}</a>
                </div>
            `;
        }
    }).join("");
}

function renderExperience(experience, templateType) {
    if (!experience || experience.length === 0) return "<p class='no-data-msg'>No work history added yet.</p>";
    
    if (templateType === "template-minimal" || templateType === "template-corporate" || templateType === "template-marketing-resume") {
        return experience.map(exp => `
            <div class="clean-experience-item">
                <div class="exp-title-row">
                    <strong>${exp.role || ''}</strong>
                    <span class="exp-duration">${exp.duration || ''}</span>
                </div>
                <div class="exp-company">${exp.company || ''}</div>
                <p class="exp-desc">${exp.description || ''}</p>
            </div>
        `).join("");
    }
    
    // Default Timeline style (Modern / Dark / Creative)
    return `
        <div class="timeline">
            <div class="timeline-line"></div>
            ${experience.map(exp => `
                <div class="timeline-item scroll-reveal">
                    <div class="timeline-dot"></div>
                    <div class="timeline-date">${exp.duration || ''}</div>
                    <div class="timeline-card">
                        <h3>${exp.role || ''}</h3>
                        <span class="timeline-location">${exp.company || ''}</span>
                        <p>${exp.description || ''}</p>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

function renderTestimonials(testimonials, templateType) {
    if (!testimonials || testimonials.length === 0) return "";
    
    if (templateType === "template-minimal") {
        return `
            <div class="minimal-testimonials">
                ${testimonials.map(t => `
                    <blockquote class="minimal-quote">
                        <p>"${t.text || ''}"</p>
                        <cite>&mdash; ${t.name || ''}, ${t.role || ''}</cite>
                    </blockquote>
                `).join("")}
            </div>
        `;
    }
    
    return `
        <div class="testimonials-grid">
            ${testimonials.map(t => `
                <div class="testimonial-card scroll-reveal">
                    <div class="quote-icon"><i class="fa-solid fa-quote-left"></i></div>
                    <p class="testimonial-text">"${t.text || ''}"</p>
                    <div class="testimonial-user">
                        <div class="user-info">
                            <h4>${t.name || ''}</h4>
                            <p>${t.role || ''}</p>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

function renderProjectModals(projects) {
    if (!projects || projects.length === 0) return "";
    return projects.map(project => {
        const projectId = project.id;
        const tools = project.tools || 'Digital Marketing';
        const imgUrl = getImagePath(project.imagePath || project.imageUrl);
        const desc = getSafeText(project.description, "");
        const externalLinkHtml = project.link 
            ? `<div style="margin-top: 2.5rem; text-align: center;">
                 <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Campaign Site
                 </a>
               </div>`
            : '';
            
        return `
            <div id="modal-project-${projectId}" class="modal">
                <div class="modal-content">
                    <button class="modal-close" aria-label="Close modal">&times;</button>
                    <span class="modal-category">Campaign Case Study</span>
                    <h2>${project.title}</h2>
                    <div class="modal-meta">
                        <span><strong>Role:</strong> Project Strategist</span>
                        <span><strong>Tools:</strong> ${tools}</span>
                    </div>
                    <div class="modal-body-img" style="margin: 1.5rem 0; text-align: center; border-radius: 8px; overflow: hidden; max-height: 350px;">
                        <img src="${imgUrl}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                    </div>
                    <hr>
                    <h3 style="margin-top: 1.5rem;">Case Study Overview</h3>
                    <p style="line-height: 1.6; color: var(--color-text-muted);">${desc}</p>
                    ${externalLinkHtml}
                </div>
            </div>
        `;
    }).join("");
}

function renderSuccessModal(studentName) {
    const firstName = studentName ? studentName.split(' ')[0] : 'Alex';
    return `
        <div id="successModal" class="success-modal">
            <div class="success-modal-content">
                <div class="success-icon">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h2>Message Sent!</h2>
                <p>Thank you for reaching out. <span id="successModalName">${firstName}</span> will get back to you as soon as possible!</p>
                <button class="btn btn-primary" id="closeSuccessBtn">Done</button>
            </div>
        </div>
    `;
}

// Helper to parse typewriter roles from Firestore or use defaults
function getTypewriterWords(data) {
    const p = data.profile;
    if (p.typewriterRoles && p.typewriterRoles.trim()) {
        const roles = p.typewriterRoles.split(',')
            .map(r => r.trim())
            .filter(r => r.length > 0);
        if (roles.length > 0) {
            return JSON.stringify(roles);
        }
    }
    return JSON.stringify([
        p.title || "Digital Marketing Student",
        "SEO Strategist",
        "Social Media Manager",
        "Content Creator"
    ]);
}

// Helper to generate the scrolling marquee text from typewriter roles
function getMarqueeText(data) {
    const p = data.profile;
    let roles = [];
    if (p.typewriterRoles && p.typewriterRoles.trim()) {
        roles = p.typewriterRoles.split(',')
            .map(r => r.trim())
            .filter(r => r.length > 0);
    }
    if (roles.length === 0) {
        roles = [
            "SEO STRATEGY",
            "PPC AUDITS",
            "SOCIAL CAMPAIGNS",
            "GROWTH MARKETING",
            "CONTENT CREATION",
            "LEAD LOOPS"
        ];
    }
    const upperRoles = roles.map(r => r.toUpperCase());
    const singleCycle = upperRoles.join(' • ') + ' •';
    return `${singleCycle} ${singleCycle} ${singleCycle} ${singleCycle}`;
}

// ==========================================
// TEMPLATE LAYOUT RENDERERS
// ==========================================

// 1. MODERN GRADIENT LAYOUT RENDERER
function renderModernGradientTemplate(data) {
    const p = data.profile;
    const firstName = p.name ? p.name.split(' ')[0] : 'Alex';
    const lastName = p.name ? p.name.split(' ').slice(1).join(' ') : 'Marketing';
    const cvPath = cleanAssetPath(p.cvPath);
    const typingWords = getTypewriterWords(data);

    return `
        <header class="header">
            <div class="nav-container container">
                <a href="#" class="logo" id="navLogo">
                    <span class="gradient-text">${firstName}</span>${lastName}
                </a>
                <nav class="nav-menu" id="navMenu">
                    <ul>
                        <li><a href="#home" class="nav-link active">Home</a></li>
                        <li><a href="#about" class="nav-link">About</a></li>
                        <li><a href="#skills" class="nav-link">Skills</a></li>
                        <li><a href="#projects" class="nav-link">Projects</a></li>
                        <li><a href="#experience" class="nav-link">Experience</a></li>
                        <li><a href="#contact" class="nav-link">Contact</a></li>
                        ${cvPath ? `<li class="nav-cv-wrapper"><a id="headerCvLink" href="${cvPath}" target="_blank" class="nav-cv-btn">Download CV</a></li>` : ''}
                    </ul>
                </nav>
                <div class="nav-actions">
                    <button id="themeToggle" class="theme-toggle-btn" aria-label="Toggle theme">
                        <i class="fa-solid fa-moon"></i>
                    </button>
                    <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </button>
                </div>
            </div>
        </header>

        <main>
            <!-- Hero -->
            <section id="home" class="hero-section section-padding-large">
                <div class="container hero-grid">
                    <div class="hero-content scroll-reveal">
                        <span id="heroBadge" class="badge">${getSafeText(p.heroBadgeText, 'Open for Internships & Projects')}</span>
                        <h1 class="hero-title">Hi, I'm <span class="gradient-text">${getSafeText(p.name, 'Alex Morgan')}</span></h1>
                        <h2 class="hero-subtitle">I am a <span class="typing-text" id="heroTypingText" data-words='${typingWords}'></span></h2>
                        <p class="hero-description">${getSafeText(p.bio, '')}</p>
                        <div class="hero-buttons">
                            <a href="#projects" class="btn btn-primary">View My Work <i class="fa-solid fa-arrow-right"></i></a>
                            <a href="#contact" class="btn btn-secondary">Contact Me</a>
                        </div>
                    </div>
                    <div class="hero-image-container scroll-reveal">
                        <div class="hero-blob"></div>
                        <img src="assets/images/hero_marketing.png" alt="Profile Illustration" class="hero-image" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                    </div>
                </div>
            </section>

            <!-- About -->
            <section id="about" class="about-section section-padding">
                <div class="container">
                    <div class="section-header scroll-reveal">
                        <span class="section-tag">Who I Am</span>
                        <h2 class="section-title">About Me</h2>
                        <div class="underline"></div>
                    </div>
                    <div class="about-grid">
                        <div class="about-image-wrapper scroll-reveal">
                            <img src="${getImagePath(p.profilePhotoPath)}" alt="${p.name}" class="about-avatar" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                            <div class="about-experience-badge">
                                <span class="num">${getSafeText(p.expYears, '1+')}</span>
                                <span class="text">${getSafeText(p.expLabel, 'Year of Practical Learning')}</span>
                            </div>
                        </div>
                        <div class="about-text scroll-reveal">
                            <h3>Aspiring Digital Marketer | ${getSafeText(p.name, 'Alex Morgan')}</h3>
                            <div id="aboutStory">
                                ${p.about.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p.trim()}</p>`).join('')}
                            </div>
                            <div class="about-highlights-grid">
                                <div class="highlight-card">
                                    <i class="fa-solid fa-graduation-cap"></i>
                                    <div>
                                        <h4>Education</h4>
                                        <p>${getSafeText(p.educationText, '')}</p>
                                    </div>
                                </div>
                                <div class="highlight-card">
                                    <i class="fa-solid fa-location-dot"></i>
                                    <div>
                                        <h4>Location</h4>
                                        <p>${getSafeText(p.location, '')}</p>
                                    </div>
                                </div>
                                <div class="highlight-card">
                                    <i class="fa-solid fa-briefcase"></i>
                                    <div>
                                        <h4>Availability</h4>
                                        <p>${getSafeText(p.availabilityText, '')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Skills -->
            <section id="skills" class="skills-section section-padding bg-alt">
                <div class="container">
                    <div class="section-header scroll-reveal">
                        <span class="section-tag">My Expertise</span>
                        <h2 class="section-title">Skills & Tools</h2>
                        <div class="underline"></div>
                    </div>
                    <div class="skills-grid">
                        ${renderSkills(data.skills, 'template-modern')}
                    </div>
                </div>
            </section>

            <!-- Experience -->
            <section id="experience" class="experience-section section-padding">
                <div class="container">
                    <div class="section-header scroll-reveal">
                        <span class="section-tag">My Journey</span>
                        <h2 class="section-title">Work Experience</h2>
                        <div class="underline"></div>
                    </div>
                    ${renderExperience(data.experience, 'template-modern')}
                </div>
            </section>

            <!-- Projects -->
            <section id="projects" class="projects-section section-padding bg-alt">
                <div class="container">
                    <div class="section-header scroll-reveal">
                        <span class="section-tag">My Work</span>
                        <h2 class="section-title">Featured Campaigns</h2>
                        <div class="underline"></div>
                    </div>
                    <div class="projects-grid">
                        ${renderProjects(data.projects, 'template-modern')}
                    </div>
                </div>
            </section>

            <!-- Certificates -->
            <section id="certificates" class="certifications-section section-padding">
                <div class="container">
                    <div class="section-header scroll-reveal">
                        <span class="section-tag">Accreditation</span>
                        <h2 class="section-title">Certifications</h2>
                        <div class="underline"></div>
                    </div>
                    <div class="certs-grid">
                        ${renderCertificates(data.certificates, 'template-modern')}
                    </div>
                </div>
            </section>

            <!-- Testimonials -->
            ${data.testimonials && data.testimonials.length > 0 ? `
            <section id="testimonials" class="testimonials-section section-padding bg-alt">
                <div class="container">
                    <div class="section-header scroll-reveal">
                        <span class="section-tag">Recommendations</span>
                        <h2 class="section-title">Client Testimonials</h2>
                        <div class="underline"></div>
                    </div>
                    ${renderTestimonials(data.testimonials, 'template-modern')}
                </div>
            </section>
            ` : ''}

            <!-- CV Download Banner -->
            ${cvPath ? `
            <section id="cv" class="cv-section section-padding">
                <div class="container scroll-reveal">
                    <div class="cv-card">
                        <div class="cv-icon"><i class="fa-solid fa-file-pdf"></i></div>
                        <h2>Curriculum Vitae</h2>
                        <p>Download my comprehensive resume for detailed information about my academic achievements, internships, and marketing certifications.</p>
                        <a href="${cvPath}" target="_blank" class="btn btn-primary">Download My CV <i class="fa-solid fa-download"></i></a>
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- Contact -->
            <section id="contact" class="contact-section section-padding bg-alt">
                <div class="container">
                    <div class="section-header scroll-reveal">
                        <span class="section-tag">Get In Touch</span>
                        <h2 class="section-title">Contact Me</h2>
                        <div class="underline"></div>
                    </div>
                    <div class="contact-grid">
                        <div class="contact-info scroll-reveal">
                            <h3>Let's Collaborate!</h3>
                            <p>Have an open internship opportunity, a freelance marketing campaign project, or want to discuss SEO metrics? Reach out using these contact channels.</p>
                            <div class="contact-info-list">
                                <div class="info-item">
                                    <div class="icon"><i class="fa-solid fa-envelope"></i></div>
                                    <div>
                                        <h4>Email</h4>
                                        <a href="mailto:${p.email}">${p.email}</a>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <div class="icon"><i class="fa-solid fa-phone"></i></div>
                                    <div>
                                        <h4>Phone</h4>
                                        <a href="tel:${p.phone}">${p.phone}</a>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <div class="icon"><i class="fa-solid fa-location-dot"></i></div>
                                    <div>
                                        <h4>Location</h4>
                                        <p>${p.location}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="contact-socials-wrapper">
                                <h4>Follow My Updates</h4>
                                <div class="social-links">
                                    ${renderSocialLinks(data.socials)}
                                </div>
                            </div>
                        </div>
                        <div class="contact-form-container scroll-reveal">
                            <form id="contactForm">
                                <div class="form-group">
                                    <label for="formName">Full Name</label>
                                    <div class="input-wrapper">
                                        <input type="text" id="formName" placeholder="John Doe">
                                        <i class="fa-solid fa-user input-icon"></i>
                                    </div>
                                    <span class="error-msg" id="nameError">Name is required</span>
                                </div>
                                <div class="form-group">
                                    <label for="formEmail">Email Address</label>
                                    <div class="input-wrapper">
                                        <input type="email" id="formEmail" placeholder="john@example.com">
                                        <i class="fa-solid fa-envelope input-icon"></i>
                                    </div>
                                    <span class="error-msg" id="emailError">Enter a valid email</span>
                                </div>
                                <div class="form-group">
                                    <label for="formMessage">Your Message</label>
                                    <div class="input-wrapper">
                                        <textarea id="formMessage" rows="5" placeholder="Hi, I'd like to collaborate..."></textarea>
                                        <i class="fa-solid fa-message input-icon" style="top: 1.5rem;"></i>
                                    </div>
                                    <span class="error-msg" id="messageError">Message cannot be empty</span>
                                </div>
                                <button type="submit" class="btn btn-primary btn-block">Send Campaign Pitch <i class="fa-solid fa-paper-plane"></i></button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <footer class="footer">
            <div class="container footer-grid">
                <div class="footer-brand">
                    <a href="#" class="logo"><span class="gradient-text">${firstName}</span>${lastName}</a>
                    <p>Building high-performing SEO campaigns and digital marketing growth loops.</p>
                </div>
                <div class="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#skills">Skills</a></li>
                        <li><a href="#projects">Projects</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-socials">
                    <h4>Social Channels</h4>
                    <div class="social-links">
                        ${renderSocialLinks(data.socials)}
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} <span id="footerCopyrightName">${p.name}</span>. All rights reserved.</p>
            </div>
        </footer>
    `;
}

// 2. MINIMAL CLEAN LAYOUT RENDERER
function renderMinimalCleanTemplate(data) {
    const p = data.profile;
    const cvPath = cleanAssetPath(p.cvPath);
    return `
        <div class="minimal-wrapper">
            <!-- Fixed Left Sidebar -->
            <aside class="minimal-sidebar">
                <div class="minimal-sidebar-inner">
                    <div class="minimal-profile">
                        <img class="minimal-avatar" src="${getImagePath(p.profilePhotoPath)}" alt="${p.name}" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                        <h1 class="minimal-name">${p.name}</h1>
                        <p class="minimal-title">${p.title}</p>
                    </div>
                    
                    <div class="minimal-contact-info">
                        <div class="minimal-info-row">
                            <i class="fa-solid fa-envelope"></i>
                            <a href="mailto:${p.email}">${p.email}</a>
                        </div>
                        <div class="minimal-info-row">
                            <i class="fa-solid fa-phone"></i>
                            <a href="tel:${p.phone}">${p.phone}</a>
                        </div>
                        <div class="minimal-info-row">
                            <i class="fa-solid fa-location-dot"></i>
                            <span>${p.location}</span>
                        </div>
                    </div>

                    <div class="minimal-social-links">
                        ${renderSocialLinks(data.socials)}
                    </div>

                    <div class="minimal-actions">
                        ${cvPath ? `<a href="${cvPath}" target="_blank" class="minimal-cv-button"><i class="fa-solid fa-arrow-down-long"></i> Download CV</a>` : ''}
                        <button id="themeToggle" class="minimal-theme-toggle" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i> Mode</button>
                    </div>
                </div>
            </aside>

            <!-- Scrollable Right Content -->
            <main class="minimal-content">
                <!-- About -->
                <section id="about" class="minimal-section">
                    <h2 class="minimal-section-title">About Me</h2>
                    <div class="minimal-about-text">
                        ${p.about.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p.trim()}</p>`).join('')}
                    </div>
                    <div class="minimal-meta-grid">
                        <div><strong>Education:</strong> ${p.educationText}</div>
                        <div><strong>Availability:</strong> ${p.availabilityText}</div>
                    </div>
                </section>

                <!-- Skills -->
                <section id="skills" class="minimal-section">
                    <h2 class="minimal-section-title">Skills & Expertise</h2>
                    <div class="minimal-skills-container">
                        ${renderSkills(data.skills, 'template-minimal')}
                    </div>
                </section>

                <!-- Experience -->
                <section id="experience" class="minimal-section">
                    <h2 class="minimal-section-title">Professional Experience</h2>
                    <div class="minimal-experience-list">
                        ${renderExperience(data.experience, 'template-minimal')}
                    </div>
                </section>

                <!-- Projects -->
                <section id="projects" class="minimal-section">
                    <h2 class="minimal-section-title">Campaign Case Studies</h2>
                    <div class="minimal-projects-list">
                        ${renderProjects(data.projects, 'template-minimal')}
                    </div>
                </section>

                <!-- Certificates -->
                <section id="certificates" class="minimal-section">
                    <h2 class="minimal-section-title">Certifications</h2>
                    <div class="minimal-certs-list">
                        ${renderCertificates(data.certificates, 'template-minimal')}
                    </div>
                </section>

                <!-- Testimonials -->
                ${data.testimonials && data.testimonials.length > 0 ? `
                <section id="testimonials" class="minimal-section">
                    <h2 class="minimal-section-title">Recommendations</h2>
                    ${renderTestimonials(data.testimonials, 'template-minimal')}
                </section>
                ` : ''}

                <!-- Contact Form -->
                <section id="contact" class="minimal-section minimal-contact-section">
                    <h2 class="minimal-section-title">Get in Touch</h2>
                    <form id="contactForm" class="minimal-contact-form">
                        <div class="minimal-form-row">
                            <div class="minimal-form-group">
                                <label for="formName">Full Name</label>
                                <input type="text" id="formName" placeholder="Your name">
                                <span class="error-msg" id="nameError">Required</span>
                            </div>
                            <div class="minimal-form-group">
                                <label for="formEmail">Email Address</label>
                                <input type="email" id="formEmail" placeholder="your@email.com">
                                <span class="error-msg" id="emailError">Enter valid email</span>
                            </div>
                        </div>
                        <div class="minimal-form-group">
                            <label for="formMessage">Your Message</label>
                            <textarea id="formMessage" rows="5" placeholder="Hi, let's connect..."></textarea>
                            <span class="error-msg" id="messageError">Required</span>
                        </div>
                        <button type="submit" class="minimal-submit-btn">Send Message &rarr;</button>
                    </form>
                </section>

                <!-- Footer -->
                <footer class="minimal-footer">
                    <p>&copy; ${new Date().getFullYear()} ${p.name}. All rights reserved.</p>
                </footer>
            </main>
        </div>
    `;
}

// 3. DARK NEON LAYOUT RENDERER
function renderDarkNeonTemplate(data) {
    const p = data.profile;
    const cvPath = cleanAssetPath(p.cvPath);
    const typingWords = getTypewriterWords(data);

    return `
        <div class="neon-body-wrapper">
            <!-- Top Horizontal Navigation -->
            <nav class="neon-nav">
                <div class="neon-nav-container">
                    <a href="#" class="neon-nav-logo">
                        <span class="neon-pink">&lt;</span>${p.name ? p.name.split(' ')[0] : 'Alex'}<span class="neon-blue">.io /&gt;</span>
                    </a>
                    <ul class="neon-nav-menu" id="navMenu">
                        <li><a href="#home" class="neon-nav-link active">Home</a></li>
                        <li><a href="#about" class="neon-nav-link">About</a></li>
                        <li><a href="#skills" class="neon-nav-link">Skills</a></li>
                        <li><a href="#projects" class="neon-nav-link">Projects</a></li>
                        <li><a href="#certificates" class="neon-nav-link">Certificates</a></li>
                        <li><a href="#contact" class="neon-nav-link">Contact</a></li>
                    </ul>
                    <div class="neon-nav-actions">
                        ${cvPath ? `<a id="headerCvLink" href="${cvPath}" target="_blank" class="neon-cv-btn"><i class="fa-solid fa-terminal"></i> CV.bin</a>` : ''}
                        <button id="themeToggle" class="neon-theme-toggle" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i></button>
                        <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
                            <span class="bar"></span>
                            <span class="bar"></span>
                            <span class="bar"></span>
                        </button>
                    </div>
                </div>
            </nav>

            <main class="neon-container-main">
                <!-- Hero Dashboard Card -->
                <section id="home" class="neon-dashboard-hero scroll-reveal">
                    <div class="neon-glow-card-hero">
                        <div class="neon-card-header">
                            <span class="neon-system-dot green"></span>
                            <span class="neon-system-dot yellow"></span>
                            <span class="neon-system-dot red"></span>
                            <span class="neon-status-pill">${getSafeText(p.heroBadgeText, 'SYSTEM ONLINE')}</span>
                        </div>
                        <div class="neon-hero-content">
                            <div class="neon-hero-left">
                                <h1 class="neon-glitch-text" data-text="${p.name}">${p.name}</h1>
                                <h2>&gt; <span id="heroTypingText" class="typing-text neon-blue" data-words='${typingWords}'></span></h2>
                                <p class="neon-binary-bio">${p.bio}</p>
                                <div class="neon-hero-btns">
                                    <a href="#projects" class="neon-btn-primary">EXECUTE_PROJECTS()</a>
                                    <a href="#contact" class="neon-btn-secondary">INITIALIZE_CONTACT()</a>
                                </div>
                            </div>
                            <div class="neon-hero-right">
                                <div class="neon-cyber-avatar-frame">
                                    <div class="neon-frame-glow"></div>
                                    <img class="neon-cyber-avatar" src="${getImagePath(p.profilePhotoPath)}" alt="${p.name}" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- System Info (About) -->
                <section id="about" class="neon-section">
                    <h2 class="neon-section-header">&gt;_ SYSTEM_INFO (About)</h2>
                    <div class="neon-about-grid">
                        <div class="neon-about-card scroll-reveal">
                            <h3>STORY.log</h3>
                            <div class="neon-about-paragraphs">
                                ${p.about.split('\n').filter(p => p.trim() !== '').map(p => `<p>&gt; ${p.trim()}</p>`).join('')}
                            </div>
                        </div>
                        <div class="neon-stats-card scroll-reveal">
                            <h3>SYSTEM_SPECS</h3>
                            <div class="neon-spec-item">
                                <span class="label">LOCATION:</span>
                                <span class="val neon-blue">${p.location}</span>
                            </div>
                            <div class="neon-spec-item">
                                <span class="label">ACADEMICS:</span>
                                <span class="val neon-pink">${p.educationText}</span>
                            </div>
                            <div class="neon-spec-item">
                                <span class="label">STATUS:</span>
                                <span class="val neon-green">${p.availabilityText}</span>
                            </div>
                            <div class="neon-spec-item">
                                <span class="label">EXPERIENCE_INDEX:</span>
                                <span class="val neon-yellow">${p.expYears} (${p.expLabel})</span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Skill Cores -->
                <section id="skills" class="neon-section">
                    <h2 class="neon-section-header">&gt;_ SKILL_CORES (Skills)</h2>
                    <div class="neon-skills-dashboard">
                        ${renderSkills(data.skills, 'template-dark')}
                    </div>
                </section>

                <!-- Experience Timeline -->
                <section id="experience" class="neon-section">
                    <h2 class="neon-section-header">&gt;_ TIMELINE_LOGS (Experience)</h2>
                    ${renderExperience(data.experience, 'template-dark')}
                </section>

                <!-- Featured Projects -->
                <section id="projects" class="neon-section">
                    <h2 class="neon-section-header">&gt;_ CASE_STUDIES (Projects)</h2>
                    <div class="neon-projects-container">
                        ${renderProjects(data.projects, 'template-dark')}
                    </div>
                </section>

                <!-- Credentials (Certificates) -->
                <section id="certificates" class="neon-section">
                    <h2 class="neon-section-header">&gt;_ CREDENTIALS_STORE (Certifications)</h2>
                    <div class="neon-certs-container">
                        ${renderCertificates(data.certificates, 'template-dark')}
                    </div>
                </section>

                <!-- Testimonials -->
                ${data.testimonials && data.testimonials.length > 0 ? `
                <section id="testimonials" class="neon-section">
                    <h2 class="neon-section-header">&gt;_ PEER_REVIEWS (Testimonials)</h2>
                    ${renderTestimonials(data.testimonials, 'template-dark')}
                </section>
                ` : ''}

                <!-- Contact Terminal Panel -->
                <section id="contact" class="neon-section">
                    <h2 class="neon-section-header">&gt;_ CONTACT_TERMINAL (Contact)</h2>
                    <div class="neon-contact-panel scroll-reveal">
                        <div class="neon-panel-left">
                            <h3>COMM_NODE_DETAILS</h3>
                            <p>Connect to core student servers directly. Operational signals accepted 24/7.</p>
                            <div class="neon-comm-info">
                                <div class="neon-comm-row">
                                    <i class="fa-solid fa-envelope"></i>
                                    <span>EMAIL: <a href="mailto:${p.email}" class="neon-pink">${p.email}</a></span>
                                </div>
                                <div class="neon-comm-row">
                                    <i class="fa-solid fa-phone"></i>
                                    <span>PULSE: <a href="tel:${p.phone}" class="neon-blue">${p.phone}</a></span>
                                </div>
                                <div class="neon-comm-row">
                                    <i class="fa-solid fa-network-wired"></i>
                                    <span>NETWORKS:</span>
                                </div>
                                <div class="neon-socials-grid">
                                    ${renderSocialLinks(data.socials)}
                                </div>
                            </div>
                        </div>
                        <div class="neon-panel-right">
                            <h3>SEND_SECURE_PACKET</h3>
                            <form id="contactForm" class="neon-terminal-form">
                                <div class="neon-form-group">
                                    <label for="formName">SENDER_NAME:</label>
                                    <input type="text" id="formName" placeholder="guest_user">
                                    <span class="error-msg" id="nameError">Null pointer exception: Name required</span>
                                </div>
                                <div class="neon-form-group">
                                    <label for="formEmail">SENDER_EMAIL:</label>
                                    <input type="email" id="formEmail" placeholder="guest@server.com">
                                    <span class="error-msg" id="emailError">Format mismatch: Invalid email address</span>
                                </div>
                                <div class="neon-form-group">
                                    <label for="formMessage">PACKET_BODY:</label>
                                    <textarea id="formMessage" rows="4" placeholder="Type transmission content..."></textarea>
                                    <span class="error-msg" id="messageError">Null payload exception: Message required</span>
                                </div>
                                <button type="submit" class="neon-submit-glow-btn">DISPATCH_PACKET()</button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Cyber Footer -->
            <footer class="neon-footer">
                <p>&copy; ${new Date().getFullYear()} ${p.name}. All rights reserved.</p>
            </footer>
        </div>
    `;
}

// 4. CREATIVE AGENCY LAYOUT RENDERER
function renderCreativeAgencyTemplate(data) {
    const p = data.profile;
    const cvPath = cleanAssetPath(p.cvPath);
    const marqueeText = getMarqueeText(data);
    return `
        <div class="creative-root">
            <!-- Custom Bold Header -->
            <header class="creative-header">
                <div class="creative-nav-container">
                    <a href="#" class="creative-brand">${p.name ? p.name.toUpperCase() : 'ALEX'}</a>
                    <nav class="creative-nav" id="navMenu">
                        <a href="#home" class="creative-nav-link active">Home</a>
                        <a href="#about" class="creative-nav-link">About</a>
                        <a href="#skills" class="creative-nav-link">Skills</a>
                        <a href="#projects" class="creative-nav-link">Projects</a>
                        <a href="#contact" class="creative-nav-link">Contact</a>
                    </nav>
                    <div class="creative-header-right">
                        ${cvPath ? `<a href="${cvPath}" target="_blank" class="creative-cv-btn">RESUME.PDF</a>` : ''}
                        <button id="themeToggle" class="creative-theme-toggle" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i></button>
                        <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
                            <span class="bar"></span>
                            <span class="bar"></span>
                            <span class="bar"></span>
                        </button>
                    </div>
                </div>
            </header>

            <main>
                <!-- Brutalist Bold Hero -->
                <section id="home" class="creative-hero">
                    <div class="creative-hero-grid">
                        <div class="creative-hero-text scroll-reveal">
                            <div class="creative-tagline-badge">${getSafeText(p.heroBadgeText, 'OPEN FOR WORK')}</div>
                            <h1 class="creative-hero-title">IM ${p.name ? p.name.toUpperCase() : 'ALEX MORGAN'}. DIGITAL GROWTH ENGINE & CAMPAIGN CREATIVE.</h1>
                            <p class="creative-hero-desc">${p.bio}</p>
                            <div class="creative-hero-links">
                                <a href="#projects" class="creative-btn-black">EXPLORE PORTFOLIO <i class="fa-solid fa-arrow-right-long"></i></a>
                                <a href="#contact" class="creative-btn-outline">SAY HELLO!</a>
                            </div>
                        </div>
                        <div class="creative-hero-visual scroll-reveal">
                            <div class="creative-photo-frame">
                                <img src="${getImagePath(p.profilePhotoPath)}" alt="${p.name}" class="creative-avatar-img" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                                <div class="creative-badge-sticker">${p.expYears} YEARS Practical</div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- About Banner -->
                <section id="about" class="creative-about-section">
                    <div class="creative-marquee">
                        <div class="creative-marquee-content">
                            ${marqueeText}
                        </div>
                    </div>
                    <div class="creative-about-grid">
                        <div class="creative-about-left scroll-reveal">
                            <h2>THE BIO BANNER</h2>
                            <p class="creative-highlight-text">${p.educationText} / Available for ${p.availabilityText}</p>
                            <div class="creative-socials-brutal">
                                ${renderSocialLinks(data.socials)}
                            </div>
                        </div>
                        <div class="creative-about-right scroll-reveal">
                            <h3>NARRATIVE</h3>
                            <div class="creative-narrative">
                                ${p.about.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p.trim()}</p>`).join('')}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Skills Stickers -->
                <section id="skills" class="creative-skills-section">
                    <div class="creative-section-title-wrap scroll-reveal">
                        <h2>SKILLS & CHIPS</h2>
                        <span class="creative-subline">Tools of the Growth Trade</span>
                    </div>
                    <div class="creative-stickers-container">
                        ${renderSkills(data.skills, 'template-creative')}
                    </div>
                </section>

                <!-- Experience -->
                <section id="experience" class="creative-experience-section">
                    <div class="creative-section-title-wrap scroll-reveal">
                        <h2>WORK TIMELINE</h2>
                    </div>
                    ${renderExperience(data.experience, 'template-creative')}
                </section>

                <!-- Projects Masonry -->
                <section id="projects" class="creative-projects-section">
                    <div class="creative-section-title-wrap scroll-reveal">
                        <h2>CASE STUDIES</h2>
                        <span class="creative-subline">Click cards to unlock campaign analytics</span>
                    </div>
                    <div class="creative-projects-masonry">
                        ${renderProjects(data.projects, 'template-creative')}
                    </div>
                </section>

                <!-- Certificates Slider/Carousel Container -->
                <section id="certificates" class="creative-certs-section">
                    <div class="creative-section-title-wrap scroll-reveal">
                        <h2>CREDENTIALS</h2>
                    </div>
                    <div class="creative-certs-slider">
                        ${renderCertificates(data.certificates, 'template-creative')}
                    </div>
                </section>

                <!-- Testimonials -->
                ${data.testimonials && data.testimonials.length > 0 ? `
                <section id="testimonials" class="creative-testimonials-section">
                    <div class="creative-section-title-wrap scroll-reveal">
                        <h2>CLIENT FEEDBACK</h2>
                    </div>
                    ${renderTestimonials(data.testimonials, 'template-creative')}
                </section>
                ` : ''}

                <!-- Contact CTA Section -->
                <section id="contact" class="creative-contact-section">
                    <div class="creative-contact-grid">
                        <div class="creative-contact-header scroll-reveal">
                            <h2>LET'S COMPILE A CAMPAIGN!</h2>
                            <p class="creative-contact-sub">Fill out the brutalist submission node below. Let's grow organic traffic together.</p>
                            <div class="creative-contact-details">
                                <div class="brutal-detail-card">
                                    <strong>DIRECT LINK:</strong>
                                    <a href="mailto:${p.email}">${p.email}</a>
                                </div>
                                <div class="brutal-detail-card">
                                    <strong>PHONE LINE:</strong>
                                    <a href="tel:${p.phone}">${p.phone}</a>
                                </div>
                            </div>
                        </div>
                        <div class="creative-contact-body scroll-reveal">
                            <form id="contactForm" class="creative-brutal-form">
                                <div class="brutal-form-group">
                                    <input type="text" id="formName" required placeholder=" ">
                                    <label for="formName">YOUR_NAME</label>
                                    <span class="error-msg" id="nameError">NAME IS REQUIRED</span>
                                </div>
                                <div class="brutal-form-group">
                                    <input type="email" id="formEmail" required placeholder=" ">
                                    <label for="formEmail">YOUR_EMAIL</label>
                                    <span class="error-msg" id="emailError">INVALID EMAIL FORMAT</span>
                                </div>
                                <div class="brutal-form-group">
                                    <textarea id="formMessage" required rows="4" placeholder=" "></textarea>
                                    <label for="formMessage">TRANSMISSION_DETAILS</label>
                                    <span class="error-msg" id="messageError">MESSAGE CANNOT BE EMPTY</span>
                                </div>
                                <button type="submit" class="creative-form-submit-btn">DISPATCH TRANSACTION <i class="fa-solid fa-arrow-right"></i></button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Creative Footer -->
            <footer class="creative-footer">
                <div class="creative-footer-container">
                    <p>&copy; ${new Date().getFullYear()} ${p.name}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    `;
}

// 5. CORPORATE PROFESSIONAL LAYOUT RENDERER
function renderCorporateProfessionalTemplate(data) {
    const p = data.profile;
    const cvPath = cleanAssetPath(p.cvPath);
    return `
        <div class="corporate-root-wrapper">
            <!-- Corporate Header -->
            <header class="corporate-top-header">
                <div class="corporate-header-container">
                    <div class="corporate-title-block">
                        <h1 class="corporate-main-name">${p.name}</h1>
                        <p class="corporate-main-title">${p.title}</p>
                    </div>
                    <div class="corporate-meta-block">
                        <div class="corp-meta-row"><i class="fa-solid fa-envelope"></i> <a href="mailto:${p.email}">${p.email}</a></div>
                        <div class="corp-meta-row"><i class="fa-solid fa-phone"></i> <a href="tel:${p.phone}">${p.phone}</a></div>
                        <div class="corp-meta-row"><i class="fa-solid fa-location-dot"></i> <span>${p.location}</span></div>
                    </div>
                </div>
                <!-- Clean navigation bar -->
                <div class="corporate-nav-bar">
                    <nav class="corporate-nav" id="navMenu">
                        <a href="#about" class="corp-nav-link active">About</a>
                        <a href="#skills" class="corp-nav-link">Skills</a>
                        <a href="#experience" class="corp-nav-link">Experience</a>
                        <a href="#projects" class="corp-nav-link">Projects</a>
                        <a href="#contact" class="corp-nav-link">Contact</a>
                    </nav>
                    <div class="corporate-header-actions">
                        ${cvPath ? `<a href="${cvPath}" target="_blank" class="corporate-header-cv"><i class="fa-solid fa-file-pdf"></i> Download Resume</a>` : ''}
                        <button id="themeToggle" class="corp-theme-toggle" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i></button>
                    </div>
                </div>
            </header>

            <main class="corporate-main-content">
                <!-- Two-Column Main Layout -->
                <div class="corporate-two-column-grid">
                    
                    <!-- Left Column: Portrait, Bio Summary, Contact Details, Social links -->
                    <aside class="corporate-left-aside">
                        <div class="corporate-panel scroll-reveal">
                            <div class="corporate-portrait-box">
                                <img src="${getImagePath(p.profilePhotoPath)}" alt="${p.name}" class="corporate-portrait-img" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                            </div>
                            <h3 class="corporate-aside-title">Personal Statement</h3>
                            <p class="corporate-aside-bio">${p.bio}</p>
                            
                            <hr class="corp-divider">
                            
                            <h3 class="corporate-aside-title">Details</h3>
                            <ul class="corporate-details-list">
                                <li><strong>Education:</strong> ${p.educationText}</li>
                                <li><strong>Availability:</strong> ${p.availabilityText}</li>
                                <li><strong>Experience:</strong> ${p.expYears} (${p.expLabel})</li>
                            </ul>

                            <hr class="corp-divider">

                            <h3 class="corporate-aside-title">Professional Networks</h3>
                            <div class="corporate-social-links">
                                ${renderSocialLinks(data.socials)}
                            </div>
                        </div>
                    </aside>

                    <!-- Right Column: Skills, Experience, Projects, Certificates -->
                    <div class="corporate-right-main">
                        <!-- About Text -->
                        <section id="about" class="corporate-panel scroll-reveal">
                            <h2 class="corporate-panel-header"><i class="fa-solid fa-user-tie"></i> Profile Summary</h2>
                            <div class="corporate-about-story">
                                ${p.about.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p.trim()}</p>`).join('')}
                            </div>
                        </section>

                        <!-- Skills -->
                        <section id="skills" class="corporate-panel scroll-reveal">
                            <h2 class="corporate-panel-header"><i class="fa-solid fa-list-check"></i> Core Competencies</h2>
                            <div class="corporate-skills-grid">
                                ${renderSkills(data.skills, 'template-corporate')}
                            </div>
                        </section>

                        <!-- Experience -->
                        <section id="experience" class="corporate-panel scroll-reveal">
                            <h2 class="corporate-panel-header"><i class="fa-solid fa-briefcase"></i> Professional Experience</h2>
                            <div class="corporate-exp-list">
                                ${renderExperience(data.experience, 'template-corporate')}
                            </div>
                        </section>

                        <!-- Projects -->
                        <section id="projects" class="corporate-panel scroll-reveal">
                            <h2 class="corporate-panel-header"><i class="fa-solid fa-diagram-project"></i> Project Case Studies</h2>
                            <div class="corporate-projects-list">
                                ${renderProjects(data.projects, 'template-corporate')}
                            </div>
                        </section>

                        <!-- Certificates -->
                        <section id="certificates" class="corporate-panel scroll-reveal">
                            <h2 class="corporate-panel-header"><i class="fa-solid fa-certificate"></i> Certifications & Credentials</h2>
                            <div class="corporate-certs-grid">
                                ${renderCertificates(data.certificates, 'template-corporate')}
                            </div>
                        </section>

                        <!-- Testimonials -->
                        ${data.testimonials && data.testimonials.length > 0 ? `
                        <section id="testimonials" class="corporate-panel scroll-reveal">
                            <h2 class="corporate-panel-header"><i class="fa-solid fa-comments"></i> References</h2>
                            ${renderTestimonials(data.testimonials, 'template-corporate')}
                        </section>
                        ` : ''}

                        <!-- Contact Form Panel -->
                        <section id="contact" class="corporate-panel scroll-reveal">
                            <h2 class="corporate-panel-header"><i class="fa-solid fa-envelope-open-text"></i> Contact & Inquiries</h2>
                            <form id="contactForm" class="corporate-contact-form">
                                <p style="margin-bottom: 1.5rem; color: var(--color-text-muted);">Please fill out the form below to initiate communication or project inquiries.</p>
                                <div class="corp-form-row">
                                    <div class="corp-form-group">
                                        <label for="formName">Full Name</label>
                                        <input type="text" id="formName" placeholder="e.g. Jane Doe">
                                        <span class="error-msg" id="nameError">Full name is required</span>
                                    </div>
                                    <div class="corp-form-group">
                                        <label for="formEmail">Email Address</label>
                                        <input type="email" id="formEmail" placeholder="e.g. name@company.com">
                                        <span class="error-msg" id="emailError">Valid email address required</span>
                                    </div>
                                </div>
                                <div class="corp-form-group">
                                    <label for="formMessage">Message Content</label>
                                    <textarea id="formMessage" rows="5" placeholder="Please type your message..."></textarea>
                                    <span class="error-msg" id="messageError">Message cannot be empty</span>
                                </div>
                                <button type="submit" class="corporate-submit-btn">Submit Inquiry</button>
                            </form>
                        </section>
                    </div>

                </div>
            </main>

            <!-- Formal Footer -->
            <footer class="corporate-footer">
                <div class="corporate-footer-container">
                    <p>&copy; ${new Date().getFullYear()} ${p.name}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    `;
}

// 6. PERSONAL BRAND LAYOUT RENDERER
function renderPersonalBrandTemplate(data) {
    const p = data.profile;
    const cvPath = cleanAssetPath(p.cvPath);
    return `
        <div class="personal-brand-root">
            <header class="personal-header">
                <div class="personal-nav-container">
                    <a href="#" class="personal-logo">${p.name}</a>
                    <nav class="personal-nav" id="navMenu">
                        <a href="#about" class="personal-nav-link active">Story</a>
                        <a href="#skills" class="personal-nav-link">Skills</a>
                        <a href="#projects" class="personal-nav-link">Work</a>
                        <a href="#certificates" class="personal-nav-link">Credentials</a>
                        <a href="#contact" class="personal-nav-link">Connect</a>
                    </nav>
                    <div class="personal-header-actions">
                        ${cvPath ? `<a href="${cvPath}" target="_blank" class="personal-cv-btn"><i class="fa-solid fa-file-pdf"></i> CV</a>` : ''}
                        <button id="themeToggle" class="personal-theme-toggle" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i></button>
                    </div>
                </div>
            </header>

            <main>
                <!-- Centered Branding Hero -->
                <section id="home" class="personal-hero-section">
                    <div class="personal-hero-container">
                        <div class="personal-avatar-wrapper">
                            <img src="${getImagePath(p.profilePhotoPath)}" alt="${p.name}" class="personal-avatar" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                        </div>
                        <h1 class="personal-hero-title">Hey, I'm <span class="gradient-accent">${p.name}</span></h1>
                        <p class="personal-hero-tagline">${p.title}</p>
                        <p class="personal-hero-bio">${p.bio}</p>
                        <div class="personal-hero-buttons">
                            <a href="#projects" class="personal-btn-main">View My Work</a>
                            <a href="#contact" class="personal-btn-sub">Let's Connect</a>
                        </div>
                    </div>
                </section>

                <!-- Storytelling About Block -->
                <section id="about" class="personal-about-section">
                    <div class="personal-section-container">
                        <h2 class="personal-section-title">My Story</h2>
                        <div class="personal-story-content">
                            <div class="personal-story-text">
                                ${p.about.split('\n').filter(paragraph => paragraph.trim() !== '').map(paragraph => `<p>${paragraph.trim()}</p>`).join('')}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Skills round badges -->
                <section id="skills" class="personal-skills-section">
                    <div class="personal-section-container">
                        <h2 class="personal-section-title">Core Expertise</h2>
                        <div class="personal-skills-badges">
                            ${renderSkills(data.skills, 'template-personal-brand')}
                        </div>
                    </div>
                </section>

                <!-- Projects case-study cards -->
                <section id="projects" class="personal-projects-section">
                    <div class="personal-section-container">
                        <h2 class="personal-section-title">Case Studies</h2>
                        <div class="personal-projects-grid">
                            ${renderProjects(data.projects, 'template-personal-brand')}
                        </div>
                    </div>
                </section>

                <!-- Certificates Timeline -->
                <section id="certificates" class="personal-certs-section">
                    <div class="personal-section-container">
                        <h2 class="personal-section-title">Credentials & Badges</h2>
                        <div class="personal-certs-timeline">
                            <div class="personal-certs-timeline-line"></div>
                            ${renderCertificates(data.certificates, 'template-personal-brand')}
                        </div>
                    </div>
                </section>

                <!-- Contact personal CTA -->
                <section id="contact" class="personal-contact-section">
                    <div class="personal-section-container">
                        <div class="personal-contact-wrapper">
                            <div class="personal-contact-head">
                                <h2>Let's build something epic together.</h2>
                                <p>Whether you need audits, growth campaigns, or content strategizing, feel free to drop a line.</p>
                                <div class="personal-contact-details">
                                    <span><i class="fa-solid fa-paper-plane"></i> <a href="mailto:${p.email}">${p.email}</a></span>
                                    <span><i class="fa-solid fa-phone"></i> <a href="tel:${p.phone}">${p.phone}</a></span>
                                </div>
                            </div>
                            <form id="contactForm" class="personal-contact-form">
                                <div class="personal-form-group">
                                    <input type="text" id="formName" required placeholder="Name">
                                    <span class="error-msg" id="nameError">Name is required</span>
                                </div>
                                <div class="personal-form-group">
                                    <input type="email" id="formEmail" required placeholder="Email">
                                    <span class="error-msg" id="emailError">Invalid email format</span>
                                </div>
                                <div class="personal-form-group">
                                    <textarea id="formMessage" required rows="4" placeholder="Your message details..."></textarea>
                                    <span class="error-msg" id="messageError">Message cannot be empty</span>
                                </div>
                                <button type="submit" class="personal-form-submit-btn">Send Message <i class="fa-solid fa-arrow-right"></i></button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <footer class="personal-footer">
                <div class="personal-footer-container">
                    <p>&copy; ${new Date().getFullYear()} ${p.name}. All rights reserved.</p>
                    <div class="personal-footer-socials">
                        ${renderSocialLinks(data.socials)}
                    </div>
                </div>
            </footer>
        </div>
    `;
}

// 7. MARKETING RESUME LAYOUT RENDERER
function renderMarketingResumeTemplate(data) {
    const p = data.profile;
    const cvPath = cleanAssetPath(p.cvPath);
    return `
        <div class="resume-root">
            <header class="resume-header">
                <div class="resume-header-container">
                    <div class="resume-header-title">
                        <h1>${p.name}</h1>
                        <p class="resume-header-tagline">${p.title}</p>
                    </div>
                    <div class="resume-header-actions">
                        <button id="themeToggle" class="resume-theme-toggle" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i> Theme</button>
                    </div>
                </div>
            </header>

            <div class="resume-layout-container">
                <div class="resume-grid">
                    <!-- Left Sidebar Column -->
                    <aside class="resume-left-col">
                        <div class="resume-section-item">
                            <div class="resume-photo-box">
                                <img src="${getImagePath(p.profilePhotoPath)}" alt="${p.name}" class="resume-profile-photo" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                            </div>
                        </div>

                        <div class="resume-section-item">
                            <h3>Contact Details</h3>
                            <ul class="resume-contact-list">
                                <li><i class="fa-solid fa-envelope"></i> <a href="mailto:${p.email}">${p.email}</a></li>
                                <li><i class="fa-solid fa-phone"></i> <a href="tel:${p.phone}">${p.phone}</a></li>
                                <li><i class="fa-solid fa-location-dot"></i> <span>${p.location}</span></li>
                            </ul>
                        </div>

                        <div class="resume-section-item">
                            <h3>Social Profiles</h3>
                            <div class="resume-socials-list">
                                ${renderSocialLinks(data.socials)}
                            </div>
                        </div>

                        ${cvPath ? `
                        <div class="resume-section-item">
                            <h3>Document Access</h3>
                            <a href="${cvPath}" target="_blank" class="resume-download-cv-btn"><i class="fa-solid fa-file-pdf"></i> Download PDF CV</a>
                        </div>
                        ` : ''}

                        <div class="resume-section-item">
                            <h3>Skills & Tools</h3>
                            <div class="resume-skills-list">
                                ${renderSkills(data.skills, 'template-marketing-resume')}
                            </div>
                        </div>
                    </aside>

                    <!-- Right Main Column -->
                    <main class="resume-right-col">
                        <section class="resume-main-section">
                            <h3 class="resume-section-heading">Professional Summary</h3>
                            <p class="resume-bio-text">${p.bio}</p>
                            <div class="resume-about-text">
                                ${p.about.split('\n').filter(paragraph => paragraph.trim() !== '').map(paragraph => `<p>${paragraph.trim()}</p>`).join('')}
                            </div>
                        </section>

                        <section class="resume-main-section">
                            <h3 class="resume-section-heading">Professional Experience</h3>
                            <div class="resume-experience-list">
                                ${renderExperience(data.experience, 'template-marketing-resume')}
                            </div>
                        </section>

                        <section class="resume-main-section">
                            <h3 class="resume-section-heading">Featured Projects</h3>
                            <div class="resume-projects-list">
                                ${renderProjects(data.projects, 'template-marketing-resume')}
                            </div>
                        </section>

                        <section class="resume-main-section">
                            <h3 class="resume-section-heading">Certifications & Training</h3>
                            <div class="resume-certs-list">
                                ${renderCertificates(data.certificates, 'template-marketing-resume')}
                            </div>
                        </section>

                        <section class="resume-main-section resume-contact-section">
                            <h3 class="resume-section-heading">Get in Touch</h3>
                            <p class="resume-contact-sub">Interested in hiring or discussing opportunities? Fill out the brief contact card below.</p>
                            <form id="contactForm" class="resume-contact-form">
                                <div class="resume-form-group">
                                    <input type="text" id="formName" required placeholder="Your Name">
                                    <span class="error-msg" id="nameError">Name is required</span>
                                </div>
                                <div class="resume-form-group">
                                    <input type="email" id="formEmail" required placeholder="Your Email">
                                    <span class="error-msg" id="emailError">Invalid email format</span>
                                </div>
                                <div class="resume-form-group">
                                    <textarea id="formMessage" required rows="3" placeholder="Message details..."></textarea>
                                    <span class="error-msg" id="messageError">Message cannot be empty</span>
                                </div>
                                <button type="submit" class="resume-submit-btn">Send Message &rarr;</button>
                            </form>
                        </section>
                    </main>
                </div>
            </div>

            <footer class="resume-footer">
                <p>&copy; ${new Date().getFullYear()} ${p.name}. All rights reserved.</p>
            </footer>
        </div>
    `;
}

// 8. PORTFOLIO GRID LAYOUT RENDERER
function renderPortfolioGridTemplate(data) {
    const p = data.profile;
    const cvPath = cleanAssetPath(p.cvPath);
    return `
        <div class="grid-layout-root">
            <header class="grid-header">
                <div class="grid-nav-container">
                    <a href="#" class="grid-brand-logo">${p.name}</a>
                    <nav class="grid-nav" id="navMenu">
                        <a href="#projects" class="grid-nav-link active">Gallery</a>
                        <a href="#about" class="grid-nav-link">About</a>
                        <a href="#skills" class="grid-nav-link">Skills</a>
                        <a href="#certificates" class="grid-nav-link">Awards</a>
                        <a href="#contact" class="grid-nav-link">Contact</a>
                    </nav>
                    <div class="grid-header-actions">
                        ${cvPath ? `<a href="${cvPath}" target="_blank" class="grid-cv-btn">CV</a>` : ''}
                        <button id="themeToggle" class="grid-theme-toggle" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i></button>
                    </div>
                </div>
            </header>

            <main>
                <!-- Small Hero Section -->
                <section class="grid-hero-section">
                    <div class="grid-hero-container">
                        <h1>Digital Portfolio & Projects</h1>
                        <p class="grid-hero-bio">${p.bio}</p>
                    </div>
                </section>

                <!-- Gallery Projects Section (Primary Focus) -->
                <section id="projects" class="grid-gallery-section">
                    <div class="grid-gallery-container">
                        <h2 class="grid-section-title">Campaign Work</h2>
                        <div class="grid-projects-masonry">
                            ${renderProjects(data.projects, 'template-portfolio-grid')}
                        </div>
                    </div>
                </section>

                <!-- About Section -->
                <section id="about" class="grid-about-section">
                    <div class="grid-about-container">
                        <div class="grid-about-left">
                            <div class="grid-about-photo-wrapper">
                                <img src="${getImagePath(p.profilePhotoPath)}" alt="${p.name}" class="grid-about-photo" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                            </div>
                        </div>
                        <div class="grid-about-right">
                            <h2>About Me</h2>
                            <p class="grid-highlight-about">${p.title}</p>
                            <div class="grid-about-body">
                                ${p.about.split('\n').filter(paragraph => paragraph.trim() !== '').map(paragraph => `<p>${paragraph.trim()}</p>`).join('')}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Skills Section -->
                <section id="skills" class="grid-skills-section">
                    <div class="grid-skills-container">
                        <h2>Skills & Capabilities</h2>
                        <div class="grid-skills-flex">
                            ${renderSkills(data.skills, 'template-portfolio-grid')}
                        </div>
                    </div>
                </section>

                <!-- Certificates Section -->
                <section id="certificates" class="grid-certs-section">
                    <div class="grid-certs-container">
                        <h2>Accreditations & Certificates</h2>
                        <div class="grid-certs-list">
                            ${renderCertificates(data.certificates, 'template-portfolio-grid')}
                        </div>
                    </div>
                </section>

                <!-- Contact Section -->
                <section id="contact" class="grid-contact-section">
                    <div class="grid-contact-container">
                        <div class="grid-contact-box">
                            <div class="grid-contact-left">
                                <h2>Get In Touch</h2>
                                <p>Interested in collaborating or discussing a campaign? Let's connect.</p>
                                <div class="grid-contact-meta">
                                    <div class="grid-meta-item"><i class="fa-solid fa-envelope"></i> <a href="mailto:${p.email}">${p.email}</a></div>
                                    <div class="grid-meta-item"><i class="fa-solid fa-phone"></i> <a href="tel:${p.phone}">${p.phone}</a></div>
                                    <div class="grid-meta-item"><i class="fa-solid fa-location-dot"></i> <span>${p.location}</span></div>
                                </div>
                                <div class="grid-socials-row">
                                    ${renderSocialLinks(data.socials)}
                                </div>
                            </div>
                            <div class="grid-contact-right">
                                <form id="contactForm" class="grid-contact-form">
                                    <div class="grid-form-group">
                                        <input type="text" id="formName" required placeholder="Name">
                                        <span class="error-msg" id="nameError">Name is required</span>
                                    </div>
                                    <div class="grid-form-group">
                                        <input type="email" id="formEmail" required placeholder="Email">
                                        <span class="error-msg" id="emailError">Invalid email format</span>
                                    </div>
                                    <div class="grid-form-group">
                                        <textarea id="formMessage" required rows="4" placeholder="Your Message"></textarea>
                                        <span class="error-msg" id="messageError">Message cannot be empty</span>
                                    </div>
                                    <button type="submit" class="grid-submit-btn">Send Message <i class="fa-solid fa-arrow-right"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer class="grid-footer">
                <p>&copy; ${new Date().getFullYear()} ${p.name}. All rights reserved.</p>
            </footer>
        </div>
    `;
}

// 9. SEO SPECIALIST LAYOUT RENDERER
function renderSeoSpecialistTemplate(data) {
    const p = data.profile;
    const cvPath = cleanAssetPath(p.cvPath);
    return `
        <div class="seo-root">
            <header class="seo-header">
                <div class="seo-nav-container">
                    <a href="#" class="seo-brand"><i class="fa-solid fa-circle-nodes"></i> SEO_${p.name ? p.name.toUpperCase().split(' ')[0] : 'ALEX'}</a>
                    <nav class="seo-nav" id="navMenu">
                        <a href="#about" class="seo-nav-link active">Audit</a>
                        <a href="#skills" class="seo-nav-link">Skills</a>
                        <a href="#projects" class="seo-nav-link">Campaigns</a>
                        <a href="#certificates" class="seo-nav-link">Trust_Badges</a>
                        <a href="#contact" class="seo-nav-link">CTR_Contact</a>
                    </nav>
                    <div class="seo-header-actions">
                        ${cvPath ? `<a href="${cvPath}" target="_blank" class="seo-cv-btn"><i class="fa-solid fa-chart-bar"></i> Download_Audit</a>` : ''}
                        <button id="themeToggle" class="seo-theme-toggle" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i></button>
                    </div>
                </div>
            </header>

            <main>
                <!-- Hero Section with Analytics KPI Stats Cards -->
                <section class="seo-hero-section">
                    <div class="seo-hero-container">
                        <div class="seo-hero-layout">
                            <div class="seo-hero-left">
                                <span class="seo-hero-badge"><i class="fa-solid fa-radar"></i> Organic Growth Strategist</span>
                                <h1 class="seo-hero-title">${p.name}</h1>
                                <p class="seo-hero-desc">${p.bio}</p>
                                <div class="seo-hero-btns">
                                    <a href="#projects" class="seo-btn-primary">View Case Studies</a>
                                    <a href="#contact" class="seo-btn-secondary">Request Site Audit</a>
                                </div>
                            </div>
                            <div class="seo-hero-right">
                                <div class="seo-dashboard-kpis">
                                    <div class="seo-kpi-card">
                                        <div class="kpi-head">
                                            <span>SEO Audit</span>
                                            <i class="fa-solid fa-magnifying-glass-chart"></i>
                                        </div>
                                        <div class="kpi-value">98.4%</div>
                                        <div class="kpi-change positive">+14.2% YoY</div>
                                    </div>
                                    <div class="seo-kpi-card">
                                        <div class="kpi-head">
                                            <span>Google Ads</span>
                                            <i class="fa-solid fa-arrow-up-right-dots"></i>
                                        </div>
                                        <div class="kpi-value">4.8x</div>
                                        <div class="kpi-change positive">ROAS Peak</div>
                                    </div>
                                    <div class="seo-kpi-card">
                                        <div class="kpi-head">
                                            <span>Content CTR</span>
                                            <i class="fa-solid fa-mouse-pointer"></i>
                                        </div>
                                        <div class="kpi-value">6.2%</div>
                                        <div class="kpi-change positive">+2.1% CTR</div>
                                    </div>
                                    <div class="seo-kpi-card">
                                        <div class="kpi-head">
                                            <span>Conversions</span>
                                            <i class="fa-solid fa-circle-check"></i>
                                        </div>
                                        <div class="kpi-value">12.8k</div>
                                        <div class="kpi-change positive">Leads Secured</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Audit About / Storytelling section -->
                <section id="about" class="seo-about-section">
                    <div class="seo-section-container">
                        <div class="seo-about-grid">
                            <div class="seo-about-visual">
                                <div class="seo-avatar-box">
                                    <img src="${getImagePath(p.profilePhotoPath)}" alt="${p.name}" class="seo-avatar" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                                </div>
                            </div>
                            <div class="seo-about-content">
                                <h2>Audited Bio Banner</h2>
                                <p class="seo-about-highlight">${p.title}</p>
                                <div class="seo-about-story">
                                    ${p.about.split('\n').filter(paragraph => paragraph.trim() !== '').map(paragraph => `<p>${paragraph.trim()}</p>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Skills Section as stats meters -->
                <section id="skills" class="seo-skills-section">
                    <div class="seo-section-container">
                        <h2>Analytics & Performance Skills</h2>
                        <div class="seo-skills-grid">
                            ${renderSkills(data.skills, 'template-seo-specialist')}
                        </div>
                    </div>
                </section>

                <!-- Projects as SEO audits & campaign case studies -->
                <section id="projects" class="seo-projects-section">
                    <div class="seo-section-container">
                        <h2>Audited Case Campaigns</h2>
                        <div class="seo-projects-grid">
                            ${renderProjects(data.projects, 'template-seo-specialist')}
                        </div>
                    </div>
                </section>

                <!-- Certificates as trust badges -->
                <section id="certificates" class="seo-certs-section">
                    <div class="seo-section-container">
                        <h2>Certified Credentials & Trust Badges</h2>
                        <div class="seo-certs-grid">
                            ${renderCertificates(data.certificates, 'template-seo-specialist')}
                        </div>
                    </div>
                </section>

                <!-- Contact CTA section -->
                <section id="contact" class="seo-contact-section">
                    <div class="seo-section-container">
                        <div class="seo-contact-card">
                            <div class="seo-contact-left">
                                <h2>Deploy Marketing Audit</h2>
                                <p>Ready to boost conversions, build ranking organic visibility, or run high-performing PPC ads? Fill in the query form.</p>
                                <div class="seo-contact-details">
                                    <div class="seo-detail-row"><i class="fa-solid fa-envelope-open-text"></i> <a href="mailto:${p.email}">${p.email}</a></div>
                                    <div class="seo-detail-row"><i class="fa-solid fa-headset"></i> <a href="tel:${p.phone}">${p.phone}</a></div>
                                    <div class="seo-detail-row"><i class="fa-solid fa-globe"></i> <span>${p.location}</span></div>
                                </div>
                                <div class="seo-socials-row">
                                    ${renderSocialLinks(data.socials)}
                                </div>
                            </div>
                            <div class="seo-contact-right">
                                <form id="contactForm" class="seo-contact-form">
                                    <div class="seo-form-group">
                                        <input type="text" id="formName" required placeholder="Name / Organization">
                                        <span class="error-msg" id="nameError">Name is required</span>
                                    </div>
                                    <div class="seo-form-group">
                                        <input type="email" id="formEmail" required placeholder="Email Address">
                                        <span class="error-msg" id="emailError">Invalid email format</span>
                                    </div>
                                    <div class="seo-form-group">
                                        <textarea id="formMessage" required rows="4" placeholder="Scope details, target audit keywords..."></textarea>
                                        <span class="error-msg" id="messageError">Details are required</span>
                                    </div>
                                    <button type="submit" class="seo-submit-btn">Run Campaign Audit &rarr;</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer class="seo-footer">
                <p>&copy; ${new Date().getFullYear()} ${p.name}. All rights reserved.</p>
            </footer>
        </div>
    `;
}

// 10. SOCIAL MEDIA CREATOR LAYOUT RENDERER
function renderSocialCreatorTemplate(data) {
    const p = data.profile;
    const cvPath = cleanAssetPath(p.cvPath);
    return `
        <div class="social-creator-root">
            <header class="social-creator-header">
                <div class="social-nav-container">
                    <a href="#" class="social-brand">@${p.name ? p.name.toLowerCase().replace(/\s+/g, '') : 'alex_morgan'}</a>
                    <nav class="social-nav" id="navMenu">
                        <a href="#home" class="social-nav-link active">Feed</a>
                        <a href="#about" class="social-nav-link">Bio</a>
                        <a href="#skills" class="social-nav-link">Tags</a>
                        <a href="#certificates" class="social-nav-link">Stories</a>
                        <a href="#contact" class="social-nav-link">Collab</a>
                    </nav>
                    <div class="social-header-actions">
                        ${cvPath ? `<a href="${cvPath}" target="_blank" class="social-cv-btn">CV</a>` : ''}
                        <button id="themeToggle" class="social-theme-toggle" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i></button>
                    </div>
                </div>
            </header>

            <main>
                <!-- Hero Profile Card section -->
                <section id="home" class="social-hero-section">
                    <div class="social-hero-container">
                        <div class="social-profile-card">
                            <div class="social-profile-top">
                                <div class="social-profile-avatar-wrapper">
                                    <img src="${getImagePath(p.profilePhotoPath)}" alt="${p.name}" class="social-profile-avatar" onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                                </div>
                                <div class="social-profile-stats">
                                    <div class="stat-bubble"><strong>1.2k</strong><span>Reach</span></div>
                                    <div class="stat-bubble"><strong>${data.projects.length}</strong><span>Posts</span></div>
                                    <div class="stat-bubble"><strong>${data.skills.length}</strong><span>Topics</span></div>
                                </div>
                            </div>
                            <div class="social-profile-details">
                                <h1 class="social-profile-name">${p.name} <i class="fa-solid fa-circle-check social-verified"></i></h1>
                                <p class="social-profile-title">${p.title}</p>
                                <p class="social-profile-bio">${p.bio}</p>
                                <div class="social-profile-buttons">
                                    <a href="#contact" class="social-btn-collab">Collab</a>
                                    <a href="#about" class="social-btn-bio">Read Bio</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Certificates as Highlight bubbles -->
                <section id="certificates" class="social-highlights-section">
                    <div class="social-section-container">
                        <h2 class="social-section-title">Highlights (Certificates)</h2>
                        <div class="social-stories-grid">
                            ${renderCertificates(data.certificates, 'template-social-creator')}
                        </div>
                    </div>
                </section>

                <!-- About section -->
                <section id="about" class="social-about-section">
                    <div class="social-section-container">
                        <div class="social-about-card">
                            <h3>About the Creator</h3>
                            <div class="social-about-body">
                                ${p.about.split('\n').filter(paragraph => paragraph.trim() !== '').map(paragraph => `<p>${paragraph.trim()}</p>`).join('')}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Skills section as tags/chips -->
                <section id="skills" class="social-skills-section">
                    <div class="social-section-container">
                        <h2>Content Verticals (Skills)</h2>
                        <div class="social-skills-flex">
                            ${renderSkills(data.skills, 'template-social-creator')}
                        </div>
                    </div>
                </section>

                <!-- Projects section as social post cards -->
                <section id="projects" class="social-projects-section">
                    <div class="social-section-container">
                        <h2>Campaign Feed (Projects)</h2>
                        <div class="social-feed-grid">
                            ${renderProjects(data.projects, 'template-social-creator')}
                        </div>
                    </div>
                </section>

                <!-- Contact section like social link hub -->
                <section id="contact" class="social-contact-section">
                    <div class="social-section-container">
                        <div class="social-hub-card">
                            <h2>Link Hub & Collabs</h2>
                            <p class="social-hub-tag">Drop a collab query below. Let's design viral campaigns.</p>
                            
                            <div class="social-hub-links">
                                <a href="mailto:${p.email}" class="social-hub-link-item"><i class="fa-solid fa-envelope"></i> Email: ${p.email}</a>
                                <a href="tel:${p.phone}" class="social-hub-link-item"><i class="fa-solid fa-phone"></i> Phone: ${p.phone}</a>
                                <div class="social-hub-icons">
                                    ${renderSocialLinks(data.socials)}
                                </div>
                            </div>

                            <form id="contactForm" class="social-creator-form">
                                <div class="social-form-group">
                                    <input type="text" id="formName" required placeholder="Full Name / Brand">
                                    <span class="error-msg" id="nameError">Name is required</span>
                                </div>
                                <div class="social-form-group">
                                    <input type="email" id="formEmail" required placeholder="Collab Email">
                                    <span class="error-msg" id="emailError">Invalid email format</span>
                                </div>
                                <div class="social-form-group">
                                    <textarea id="formMessage" required rows="3" placeholder="Campaign details, reach targets, timelines..."></textarea>
                                    <span class="error-msg" id="messageError">Details are required</span>
                                </div>
                                <button type="submit" class="social-creator-submit-btn">Send Collaboration Pitch &rarr;</button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <footer class="social-creator-footer">
                <p>&copy; ${new Date().getFullYear()} ${p.name}. All rights reserved.</p>
            </footer>
        </div>
    `;
}

// ==========================================
// OFFLINE FALLBACK MOCK DATA BUILDER
// ==========================================

function getMockData() {
    return {
        profile: {
            name: "Alex Morgan",
            title: "Digital Marketing Student",
            bio: "A results-driven marketing student specializing in data-backed strategies, SEO audits, social media growth, and paid campaigns. Helping brands build a powerful digital presence.",
            about: "I am currently studying digital marketing and applying industry-standard strategies to real-world scenarios. My passion lies in understanding search engine algorithms, analyzing target audience behaviors, and crafting copy that converts.\n\nWith a strong background in content creation and analytical tools, I bridge the gap between creative visual storytelling and technical tracking (SEO, Google Ads, GA4). I thrive in dynamic team environments and am excited to bring fresh ideas and enthusiasm to my next role.",
            email: "alex.morgan@student.edu",
            phone: "+1 (555) 019-2834",
            location: "San Francisco, CA (Open to Remote)",
            profilePhotoPath: "assets/images/avatar.png",
            cvPath: "assets/cv/alex_morgan_cv.pdf",
            selectedTemplate: "template-modern",
            heroBadgeText: "Open for Internships & Projects",
            educationText: "BS in Business Marketing (Expected 2027)",
            availabilityText: "Summer Internships & Freelance",
            expYears: "1+",
            expLabel: "Year of Practical Learning",
            typewriterRoles: ""
        },
        socials: {
            linkedin: "https://linkedin.com/in/alex-morgan",
            instagram: "https://instagram.com/alexmarketing",
            facebook: "https://facebook.com/alex.morgan.marketing",
            github: "https://github.com/alexmorgan"
        },
        skills: [
            { id: "s1", name: "Search Engine Optimization (SEO)", level: 90 },
            { id: "s2", name: "Social Media Marketing", level: 85 },
            { id: "s3", name: "Content Marketing", level: 80 },
            { id: "s4", name: "Google Ads (PPC)", level: 75 },
            { id: "s5", name: "Web Analytics (GA4)", level: 70 }
        ],
        projects: [
            {
                id: "project1",
                title: "E-Commerce SEO Audit & Campaign",
                description: "Performed a complete technical and on-page SEO audit for a local eco-friendly clothing store, identifying critical crawl errors, keyword opportunities, and optimizing meta tags. Created an organic content plan that drove a substantial lift in search visibility and organic traffic.",
                tools: "SEMrush, Screaming Frog, Google Search Console, Google Analytics",
                imagePath: "assets/images/project_seo.png",
                link: "https://example.com/project-seo"
            },
            {
                id: "project2",
                title: "Local Restaurant Social Media Campaign",
                description: "Developed and executed a 30-day Instagram and TikTok marketing campaign for a local restaurant, featuring short-form video reels, high-quality food photography, interactive stories, and localized influencer outreach. Resulted in significant community engagement and new customer foot traffic.",
                tools: "Canva, CapCut, Buffer, Instagram Insights",
                imagePath: "assets/images/project_social.png",
                link: "https://example.com/project-social"
            },
            {
                id: "project3",
                title: "Fitness App User Acquisition Campaign",
                description: "Designed and ran a practice Facebook Ads campaign targeting two specific buyer personas (busy professionals and gym enthusiasts). Developed and A/B tested ad copy variations, optimized creative placements, and monitored pixel event performance to minimize cost-per-acquisition.",
                tools: "Meta Ads Manager, Canva, Google Sheets",
                imagePath: "assets/images/project_ads.png",
                link: "https://example.com/project-ads"
            },
            {
                id: "project4",
                title: "Tech Startup 30-Day Content Strategy",
                description: "Structured a comprehensive content marketing calendar for a productivity SaaS tool. Formulated TOFU, MOFU, and BOFU topics, drafted high-engagement LinkedIn posts, designed a remote work guidebook as a lead magnet, and set up Notion dashboards for campaign management.",
                tools: "Notion, Google Docs, Figma, Mailchimp",
                imagePath: "assets/images/project_content.png",
                link: "https://example.com/project-content"
            }
        ],
        certificates: [
            { id: "cert1", name: "Google Analytics Individual Qualification", issuedBy: "Google", date: "Jan 2026", filePath: "", link: "https://example.com/google-analytics" },
            { id: "cert2", name: "HubSpot Inbound Marketing Certification", issuedBy: "HubSpot Academy", date: "Nov 2025", filePath: "", link: "https://example.com/hubspot-cert" },
            { id: "cert3", name: "Meta Certified Digital Marketing Associate", issuedBy: "Meta", date: "Sep 2025", filePath: "", link: "https://example.com/meta-cert" }
        ],
        experience: [
            { id: "exp1", duration: "2025 - Present", role: "Digital Marketing Coordinator (Part-Time)", company: "GreenRoots E-Commerce", description: "Manage social channels, perform monthly SEO audits, write optimized blog copy, and run small-scale email newsletters." },
            { id: "exp2", duration: "Summer 2024", role: "Marketing Intern", company: "Local Chamber of Commerce", description: "Created visual graphics for local business highlights, updated website event calendars, and assisted in organizing regional networking events." }
        ],
        testimonials: [
            { id: "t1", text: "Alex's SEO insights helped us identify several hidden errors that were blocking our search ranking. Very professional and detail-oriented.", name: "Sarah Jenkins", role: "Owner, GreenRoots Apparel" },
            { id: "t2", text: "A creative dynamo! The reels created for our summer festival saw massive engagement, and the attendance surpassed our estimates.", name: "David Miller", role: "Director, Local Chamber of Commerce" }
        ]
    };
}

// ==========================================
// RENDER DISPATCH ENGINE
// ==========================================

function renderPortfolio(data) {
    const portfolioRoot = document.getElementById('portfolioRoot');
    if (!portfolioRoot) return;

    // Apply template configuration to body
    const selectedTemplate = (data.profile && data.profile.selectedTemplate) || "template-modern";
    
    // Remove existing template classes
    const classesToRemove = [];
    document.body.classList.forEach(cls => {
        if (cls.startsWith('template-')) {
            classesToRemove.push(cls);
        }
    });
    classesToRemove.forEach(cls => document.body.classList.remove(cls));
    
    // Add current template class
    document.body.classList.add(selectedTemplate);

    // Render inner content of selected template, plus modals and notifications
    let html = "";
    if (selectedTemplate === "template-modern") {
        html = renderModernGradientTemplate(data);
    } else if (selectedTemplate === "template-minimal") {
        html = renderMinimalCleanTemplate(data);
    } else if (selectedTemplate === "template-dark") {
        html = renderDarkNeonTemplate(data);
    } else if (selectedTemplate === "template-creative") {
        html = renderCreativeAgencyTemplate(data);
    } else if (selectedTemplate === "template-corporate") {
        html = renderCorporateProfessionalTemplate(data);
    } else if (selectedTemplate === "template-personal-brand") {
        html = renderPersonalBrandTemplate(data);
    } else if (selectedTemplate === "template-marketing-resume") {
        html = renderMarketingResumeTemplate(data);
    } else if (selectedTemplate === "template-portfolio-grid") {
        html = renderPortfolioGridTemplate(data);
    } else if (selectedTemplate === "template-seo-specialist") {
        html = renderSeoSpecialistTemplate(data);
    } else if (selectedTemplate === "template-social-creator") {
        html = renderSocialCreatorTemplate(data);
    } else {
        html = renderModernGradientTemplate(data);
    }

    // Append modals and success modal
    html += renderProjectModals(data.projects);
    html += renderSuccessModal(data.profile.name);

    portfolioRoot.innerHTML = html;

    // Set page headers/meta properties
    if (data.profile.name) {
        document.title = `${data.profile.name} | Digital Marketing Portfolio`;
        const metaAuthor = document.querySelector('meta[name="author"]');
        if (metaAuthor) metaAuthor.setAttribute('content', data.profile.name);
    }
}

// ==========================================
// MAIN DOM DOMCONTENTLOADED ENGINE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    let isOfflineMode = true;

    // Check if Firebase config variables are available from config file
    if (typeof isFirebaseConfigured !== 'undefined' && isFirebaseConfigured && db) {
        isOfflineMode = false;
        loadPortfolioFromFirestore();
    } else {
        console.log("Running in offline mock mode. Fallback data object is loaded.");
        const mockData = getMockData();
        renderPortfolio(mockData);
        initializePortfolioInteractions();
    }

    function loadPortfolioFromFirestore() {
        const studentDocRef = db.collection('students').doc(STUDENT_ID);

        studentDocRef.get().then(doc => {
            if (doc.exists) {
                const docData = doc.data();
                const data = {
                    profile: {
                        name: docData.name || "Alex Morgan",
                        title: docData.title || "Digital Marketing Specialist",
                        bio: docData.bio || "",
                        about: docData.about || "",
                        email: docData.email || "",
                        phone: docData.phone || "",
                        location: docData.location || "",
                        profilePhotoPath: docData.profilePhotoPath || docData.profilePhotoUrl || "",
                        cvPath: docData.cvPath || docData.cvUrl || "",
                        selectedTemplate: (docData.profile && docData.profile.selectedTemplate) || docData.selectedTemplate || "template-modern",
                        heroBadgeText: docData.heroBadgeText || "Open for Internships & Projects",
                        educationText: docData.educationText || "",
                        availabilityText: docData.availabilityText || "",
                        expYears: docData.expYears || "1+",
                        expLabel: docData.expLabel || "Year of Practical Learning",
                        typewriterRoles: docData.typewriterRoles || ""
                    },
                    skills: [],
                    projects: [],
                    certificates: [],
                    socials: docData.socials || {},
                    experience: [],
                    testimonials: []
                };

                // Fetch subcollections in parallel
                Promise.all([
                    db.collection('students').doc(STUDENT_ID).collection('skills').get().then(snapshot => {
                        snapshot.forEach(doc => {
                            data.skills.push({ id: doc.id, ...doc.data() });
                        });
                    }),
                    db.collection('students').doc(STUDENT_ID).collection('projects').get().then(snapshot => {
                        snapshot.forEach(doc => {
                            data.projects.push({ id: doc.id, ...doc.data() });
                        });
                    }),
                    db.collection('students').doc(STUDENT_ID).collection('certificates').get().then(snapshot => {
                        snapshot.forEach(doc => {
                            data.certificates.push({ id: doc.id, ...doc.data() });
                        });
                    }),
                    db.collection('students').doc(STUDENT_ID).collection('experience').get().then(snapshot => {
                        snapshot.forEach(doc => {
                            data.experience.push({ id: doc.id, ...doc.data() });
                        });
                    }),
                    db.collection('students').doc(STUDENT_ID).collection('testimonials').get().then(snapshot => {
                        snapshot.forEach(doc => {
                            data.testimonials.push({ id: doc.id, ...doc.data() });
                        });
                    })
                ]).then(() => {
                    // Render dynamically
                    renderPortfolio(data);
                    // Bind events and animations
                    initializePortfolioInteractions();
                }).catch(err => {
                    console.error("Subcollection loading failed: ", err);
                    renderOfflineFallback(data);
                });

            } else {
                console.warn(`Student ID '${STUDENT_ID}' not found in database. Using offline mock data.`);
                renderOfflineFallback();
            }
        }).catch(err => {
            console.error("Firestore root loading failed: ", err);
            renderOfflineFallback();
        });
    }

    function renderOfflineFallback(preloadedData) {
        const mock = preloadedData || getMockData();
        renderPortfolio(mock);
        initializePortfolioInteractions();
    }

    // ==========================================
    // PORTFOLIO INTERACTION ENGINE (RE-BOUND POST-RENDER)
    // ==========================================
    
    function initializePortfolioInteractions() {
        // 1. Header scroll shadow
        const header = document.querySelector('.header, .neon-nav, .creative-header, .corporate-top-header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 20) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
            if (window.scrollY > 20) header.classList.add('scrolled');
        }

        // 2. Light/Dark theme manager
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const themeIcon = themeToggle.querySelector('i');
            const savedTheme = localStorage.getItem('theme');
            const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

            if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
                document.body.classList.add('light-theme');
                updateThemeIcon(true, themeIcon);
            } else {
                updateThemeIcon(false, themeIcon);
            }

            themeToggle.addEventListener('click', () => {
                const isLight = document.body.classList.toggle('light-theme');
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
                updateThemeIcon(isLight, themeIcon);
            });
        }

        function updateThemeIcon(isLight, iconEl) {
            if (iconEl) {
                if (isLight) {
                    iconEl.className = 'fa-solid fa-sun';
                } else {
                    iconEl.className = 'fa-solid fa-moon';
                }
            }
        }

        // 3. Mobile Hamburger Menu Trigger
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        if (mobileMenuToggle && navMenu) {
            const links = navMenu.querySelectorAll('a, button');

            mobileMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileMenuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            links.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target) && navMenu.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }

        // 4. Typewriter Animation for Hero Section Subtitle
        const typingSpan = document.getElementById('heroTypingText');
        if (typingSpan && typingSpan.getAttribute('data-words')) {
            try {
                const words = JSON.parse(typingSpan.getAttribute('data-words'));
                let wordIndex = 0;
                let charIndex = 0;
                let isDeleting = false;
                let currentText = '';

                function type() {
                    const currentWord = words[wordIndex];
                    
                    if (isDeleting) {
                        currentText = currentWord.substring(0, charIndex - 1);
                        charIndex--;
                    } else {
                        currentText = currentWord.substring(0, charIndex + 1);
                        charIndex++;
                    }

                    typingSpan.textContent = currentText;

                    let typeSpeed = 100;
                    if (isDeleting) typeSpeed /= 2;

                    if (!isDeleting && charIndex === currentWord.length) {
                        typeSpeed = 1500;
                        isDeleting = true;
                    } else if (isDeleting && charIndex === 0) {
                        isDeleting = false;
                        wordIndex = (wordIndex + 1) % words.length;
                        typeSpeed = 300;
                    }

                    setTimeout(type, typeSpeed);
                }
                setTimeout(type, 800);
            } catch (err) {
                console.error("Typewriter parse error: ", err);
            }
        }

        // 5. Intersection Observer: Scroll Reveal animation
        const revealElements = document.querySelectorAll('.scroll-reveal');
        
        // Add dynamic staggering delays for grid lists
        const listGrids = document.querySelectorAll('.skills-grid, .projects-grid, .certs-grid, .corporate-skills-grid, .creative-stickers-container, .neon-skills-dashboard');
        listGrids.forEach(grid => {
            const children = grid.querySelectorAll('.scroll-reveal');
            children.forEach((child, index) => {
                const delay = (index % 4) * 100;
                if (delay > 0) {
                    child.classList.add(`delay-${delay}`);
                }
            });
        });

        const revealOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -45px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        revealElements.forEach(el => revealObserver.observe(el));

        // 6. Navigation Link Highlighting on Scroll
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link, .neon-nav-link, .creative-nav-link, .corp-nav-link');
        const activeNavOptions = {
            threshold: 0.15,
            rootMargin: '-20% 0px -40% 0px'
        };

        const activeNavObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${sectionId}` || (href === '#' && sectionId === 'home')) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, activeNavOptions);

        sections.forEach(section => activeNavObserver.observe(section));

        // 7. Case Study Modals Binding
        bindProjectModals();

        // 8. Contact Form Validator and Submissions
        bindContactFormValidation();
    }

    function bindProjectModals() {
        const modalTriggers = document.querySelectorAll('.modal-trigger');
        const modals = document.querySelectorAll('.modal');
        const modalCloses = document.querySelectorAll('.modal-close');

        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const targetId = trigger.getAttribute('data-target');
                const targetModal = document.getElementById(targetId);
                if (targetModal) {
                    targetModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        modalCloses.forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const parentModal = closeBtn.closest('.modal');
                if (parentModal) {
                    parentModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    if (modal.classList.contains('active')) {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
                
                const successModal = document.getElementById('successModal');
                if (successModal && successModal.classList.contains('active')) {
                    successModal.classList.remove('active');
                }
            }
        });
    }

    function bindContactFormValidation() {
        const contactForm = document.getElementById('contactForm');
        const successModal = document.getElementById('successModal');
        const closeSuccessBtn = document.getElementById('closeSuccessBtn');

        if (contactForm) {
            const nameInput = document.getElementById('formName');
            const emailInput = document.getElementById('formEmail');
            const messageInput = document.getElementById('formMessage');

            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const isNameValid = validateField(nameInput);
                const isEmailValid = validateEmailField(emailInput);
                const isMessageValid = validateField(messageInput);

                if (isNameValid && isEmailValid && isMessageValid) {
                    // Display success banner/modal
                    if (successModal) successModal.classList.add('active');
                    contactForm.reset();
                    
                    // Clear red error tags
                    [nameInput, emailInput, messageInput].forEach(inp => {
                        if (inp && inp.parentElement) {
                            inp.parentElement.classList.remove('invalid');
                        }
                    });
                }
            });

            // Input/Blur validators
            if (nameInput) {
                nameInput.addEventListener('blur', () => validateField(nameInput));
                nameInput.addEventListener('input', () => {
                    if (nameInput.value.trim() !== '') nameInput.parentElement.classList.remove('invalid');
                });
            }

            if (emailInput) {
                emailInput.addEventListener('blur', () => validateEmailField(emailInput));
                emailInput.addEventListener('input', () => {
                    if (isValidEmail(emailInput.value.trim())) emailInput.parentElement.classList.remove('invalid');
                });
            }

            if (messageInput) {
                messageInput.addEventListener('blur', () => validateField(messageInput));
                messageInput.addEventListener('input', () => {
                    if (messageInput.value.trim() !== '') messageInput.parentElement.classList.remove('invalid');
                });
            }

            function validateField(input) {
                if (!input) return false;
                if (input.value.trim() === '') {
                    input.parentElement.classList.add('invalid');
                    return false;
                }
                input.parentElement.classList.remove('invalid');
                return true;
            }

            function validateEmailField(input) {
                if (!input) return false;
                const val = input.value.trim();
                if (val === '' || !isValidEmail(val)) {
                    input.parentElement.classList.add('invalid');
                    return false;
                }
                input.parentElement.classList.remove('invalid');
                return true;
            }

            function isValidEmail(email) {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            }
        }

        if (closeSuccessBtn && successModal) {
            closeSuccessBtn.addEventListener('click', () => {
                successModal.classList.remove('active');
            });
            successModal.addEventListener('click', (e) => {
                if (e.target === successModal) successModal.classList.remove('active');
            });
        }
    }
});
