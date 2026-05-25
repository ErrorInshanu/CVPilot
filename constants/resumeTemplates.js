// constants/resumeTemplates.js
// All resume HTML templates live here.
// Add new templates below and register them in getTemplate().

// ─── Helpers ──────────────────────────────────────────────────────────────────
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  
  function buildBullets(description) {
    if (!description) return "";
    return description
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => `<div class="bullet">${l.startsWith("•") ? l : "• " + l}</div>`)
      .join("");
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // TEMPLATE 1 — classic-clean
  // Style: Image 1 (Daniel Meyer) — left name + inline italic title,
  //        grey banner section headers, 2-col skills, Georgia serif
  // ─────────────────────────────────────────────────────────────────────────────
  function buildClassicClean(resume) {
    const p = resume.personal || {};
    const name      = escapeHtml(p.fullName)  || "Your Name";
    const jobTitle  = escapeHtml(p.jobTitle)  || "";
    const email     = escapeHtml(p.email)     || "";
    const phone     = escapeHtml(p.phone)     || "";
    const location  = escapeHtml(p.location)  || "";
    const linkedin  = escapeHtml(p.linkedin)  || "";
    const github    = escapeHtml(p.github)    || "";
    const website   = escapeHtml(p.website)   || "";
    const summary   = escapeHtml(p.summary)   || "";
  
    const contactParts = [email, phone, location, linkedin, github, website].filter(Boolean);
    const contactLine  = contactParts.join(" &nbsp;|&nbsp; ");
  
    // ── Summary ──
    const summarySection = summary ? `
      <div class="section">
        <div class="section-header">SUMMARY</div>
        <p class="summary-text">${summary}</p>
      </div>` : "";
  
    // ── Experience ──
    const experienceSection = resume.experience?.length > 0 ? `
      <div class="section">
        <div class="section-header">PROFESSIONAL EXPERIENCE</div>
        ${resume.experience.map((exp) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(exp.role || exp.title || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
                ${exp.location ? ` &nbsp;|&nbsp; ${escapeHtml(exp.location)}` : ""}
              </div>
            </div>
            <div class="entry-subtitle">${escapeHtml(exp.company || exp.companyName || "")}</div>
            ${exp.description ? `<div class="entry-desc">${buildBullets(exp.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Education ──
    const educationSection = resume.education?.length > 0 ? `
      <div class="section">
        <div class="section-header">EDUCATION</div>
        ${resume.education.map((edu) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(edu.institution || edu.school || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
                ${edu.location ? ` &nbsp;|&nbsp; ${escapeHtml(edu.location)}` : ""}
              </div>
            </div>
            <div class="entry-subtitle">${escapeHtml(edu.degree || "")}${edu.field ? `, ${escapeHtml(edu.field)}` : ""}</div>
            ${edu.grade ? `<div class="entry-grade">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Skills (2 column) ──
    const skillsSection = resume.skills?.length > 0 ? `
      <div class="section">
        <div class="section-header">SKILLS</div>
        <div class="skills-grid">
          ${resume.skills.map((s) => `<div class="skill-item">• ${escapeHtml(s.name)}</div>`).join("")}
        </div>
      </div>` : "";
  
    // ── Projects ──
    const projectsSection = resume.projects?.length > 0 ? `
      <div class="section">
        <div class="section-header">PROJECTS</div>
        ${resume.projects.map((proj) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(proj.title || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.role || proj.technologies ? `<div class="entry-subtitle">${escapeHtml(proj.role || "")}${proj.technologies ? ` • ${escapeHtml(proj.technologies)}` : ""}</div>` : ""}
            ${proj.description ? `<div class="entry-desc">${buildBullets(proj.description)}</div>` : ""}
            ${proj.url ? `<div class="entry-link">${escapeHtml(proj.url)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Certifications ──
    const certsSection = resume.certifications?.length > 0 ? `
      <div class="section">
        <div class="section-header">CERTIFICATES</div>
        ${resume.certifications.map((cert) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(cert.name || "")}</span>
              </div>
              <div class="entry-date">${escapeHtml(cert.issueDate || "")}</div>
            </div>
            <div class="entry-subtitle">${escapeHtml(cert.issuer || cert.organization || "")}</div>
          </div>`).join("")}
      </div>` : "";
  
    // ── Languages ──
    const languagesSection = resume.languages?.length > 0 ? `
      <div class="section">
        <div class="section-header">LANGUAGES</div>
        <div class="lang-row">
          ${resume.languages.map((l) => `
            <span class="lang-item"><strong>${escapeHtml(l.name)}</strong> — ${escapeHtml(l.proficiency || "")}</span>
          `).join('<span class="lang-sep"> &nbsp;|&nbsp; </span>')}
        </div>
      </div>` : "";
  
    // ── Achievements ──
    const achievementsSection = resume.achievements?.length > 0 ? `
      <div class="section">
        <div class="section-header">ACHIEVEMENTS</div>
        ${resume.achievements.map((a) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(a.title || "")}</span>
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.issuer ? `<div class="entry-subtitle">${escapeHtml(a.issuer)}</div>` : ""}
            ${a.description ? `<div class="entry-desc"><div class="bullet">${escapeHtml(a.description)}</div></div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Training ──
    const trainingSection = resume.training?.length > 0 ? `
      <div class="section">
        <div class="section-header">TRAINING & WORKSHOPS</div>
        ${resume.training.map((t) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(t.title || "")}</span>
              </div>
              <div class="entry-date">${escapeHtml(t.date || "")}</div>
            </div>
            ${t.organization ? `<div class="entry-subtitle">${escapeHtml(t.organization)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Interests ──
    const interestsSection = resume.interests?.length > 0 ? `
      <div class="section">
        <div class="section-header">INTERESTS</div>
        <div class="lang-row">
          ${resume.interests.map((i) => `<span class="lang-item">${escapeHtml(i.name)}</span>`).join('<span class="lang-sep"> &nbsp;|&nbsp; </span>')}
        </div>
      </div>` : "";
  
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
  
      body {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 11px;
        color: #1a1a1a;
        background: #ffffff;
        padding: 32px 40px;
        line-height: 1.5;
      }
  
      /* ── Header ── */
      .header {
        margin-bottom: 16px;
        padding-bottom: 10px;
        border-bottom: 1.5px solid #1a1a1a;
      }
      .header-top {
        display: flex;
        align-items: baseline;
        gap: 10px;
        margin-bottom: 5px;
      }
      .header-name {
        font-size: 24px;
        font-weight: bold;
        color: #1a1a1a;
        letter-spacing: 0.5px;
      }
      .header-title {
        font-size: 13px;
        font-style: italic;
        color: #444;
      }
      .header-contact {
        font-size: 10px;
        color: #444;
      }
  
      /* ── Section ── */
      .section { margin-bottom: 14px; }
  
      .section-header {
        font-size: 10px;
        font-weight: bold;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: #1a1a1a;
        background: #f0f0f0;
        padding: 3px 6px;
        margin-bottom: 8px;
      }
  
      /* ── Summary ── */
      .summary-text {
        font-size: 11px;
        color: #333;
        line-height: 1.6;
      }
  
      /* ── Entry ── */
      .entry { margin-bottom: 9px; }
  
      .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .entry-left { flex: 1; }
  
      .entry-title {
        font-size: 11.5px;
        font-weight: bold;
        color: #1a1a1a;
      }
      .entry-subtitle {
        font-size: 10.5px;
        color: #555;
        font-style: italic;
        margin-top: 1px;
      }
      .entry-grade {
        font-size: 10px;
        color: #666;
        margin-top: 1px;
      }
      .entry-date {
        font-size: 10px;
        color: #555;
        white-space: nowrap;
        margin-left: 10px;
        padding-top: 2px;
        text-align: right;
      }
      .entry-desc { margin-top: 4px; }
      .bullet {
        font-size: 10.5px;
        color: #333;
        margin-bottom: 2px;
        padding-left: 4px;
      }
      .entry-link {
        font-size: 10px;
        color: #2563eb;
        margin-top: 3px;
      }
  
      /* ── Skills 2-col grid ── */
      .skills-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3px 20px;
      }
      .skill-item {
        font-size: 10.5px;
        color: #333;
      }
  
      /* ── Languages / Interests ── */
      .lang-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
      .lang-item { font-size: 10.5px; color: #333; }
      .lang-sep  { font-size: 10.5px; color: #999; }
    </style>
  </head>
  <body>
  
    <div class="header">
      <div class="header-top">
        <span class="header-name">${name}</span>
        ${jobTitle ? `<span class="header-title">${jobTitle}</span>` : ""}
      </div>
      <div class="header-contact">${contactLine}</div>
    </div>
  
    ${summarySection}
    ${experienceSection}
    ${educationSection}
    ${skillsSection}
    ${projectsSection}
    ${certsSection}
    ${achievementsSection}
    ${trainingSection}
    ${languagesSection}
    ${interestsSection}
  
  </body>
  </html>`;
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
  // TEMPLATE 2 — classic-bold  (your original template)
  // Style: Centered name, bold caps headers, full divider line
  // ─────────────────────────────────────────────────────────────────────────────
  function buildClassicBold(resume) {
    const p = resume.personal || {};
    const name     = escapeHtml(p.fullName)  || "Your Name";
    const jobTitle = escapeHtml(p.jobTitle)  || "";
    const email    = escapeHtml(p.email)     || "";
    const phone    = escapeHtml(p.phone)     || "";
    const location = escapeHtml(p.location)  || "";
    const linkedin = escapeHtml(p.linkedin)  || "";
    const github   = escapeHtml(p.github)    || "";
    const website  = escapeHtml(p.website)   || "";
    const summary  = escapeHtml(p.summary)   || "";
  
    const contactParts = [email, phone, location, linkedin, github, website].filter(Boolean);
    const contactLine  = contactParts.join("  •  ");
  
    const summarySection = summary ? `
      <div class="section">
        <div class="section-title">PROFESSIONAL SUMMARY</div>
        <div class="section-divider"></div>
        <p class="summary-text">${summary}</p>
      </div>` : "";
  
    const experienceSection = resume.experience?.length > 0 ? `
      <div class="section">
        <div class="section-title">WORK EXPERIENCE</div>
        <div class="section-divider"></div>
        ${resume.experience.map((exp) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(exp.role || exp.title || "")}</div>
                <div class="entry-subtitle">${escapeHtml(exp.company || exp.companyName || "")}${exp.location ? ` • ${escapeHtml(exp.location)}` : ""}</div>
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
              </div>
            </div>
            ${exp.description ? `<div class="entry-desc">${buildBullets(exp.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    const educationSection = resume.education?.length > 0 ? `
      <div class="section">
        <div class="section-title">EDUCATION</div>
        <div class="section-divider"></div>
        ${resume.education.map((edu) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}</div>
                <div class="entry-subtitle">${escapeHtml(edu.institution || edu.school || "")}${edu.board ? ` • ${escapeHtml(edu.board)}` : ""}</div>
                ${edu.grade ? `<div class="entry-grade">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
              </div>
            </div>
          </div>`).join("")}
      </div>` : "";
  
    const skillsSection = resume.skills?.length > 0 ? `
      <div class="section">
        <div class="section-title">SKILLS</div>
        <div class="section-divider"></div>
        <div class="skills-wrap">
          ${resume.skills.map((s) => `<span class="skill-tag">${escapeHtml(s.name)}</span>`).join("")}
        </div>
      </div>` : "";
  
    const projectsSection = resume.projects?.length > 0 ? `
      <div class="section">
        <div class="section-title">PROJECTS</div>
        <div class="section-divider"></div>
        ${resume.projects.map((proj) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(proj.title || "")}</div>
                <div class="entry-subtitle">${escapeHtml(proj.role || "")}${proj.technologies ? ` • ${escapeHtml(proj.technologies)}` : ""}</div>
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.description ? `<div class="entry-desc">${buildBullets(proj.description)}</div>` : ""}
            ${proj.url ? `<div class="entry-link">${escapeHtml(proj.url)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    const certsSection = resume.certifications?.length > 0 ? `
      <div class="section">
        <div class="section-title">CERTIFICATIONS</div>
        <div class="section-divider"></div>
        ${resume.certifications.map((cert) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(cert.name || "")}</div>
                <div class="entry-subtitle">${escapeHtml(cert.issuer || cert.organization || "")}</div>
              </div>
              <div class="entry-date">${escapeHtml(cert.issueDate || "")}</div>
            </div>
          </div>`).join("")}
      </div>` : "";
  
    const languagesSection = resume.languages?.length > 0 ? `
      <div class="section">
        <div class="section-title">LANGUAGES</div>
        <div class="section-divider"></div>
        <div class="skills-wrap">
          ${resume.languages.map((l) => `<span class="skill-tag">${escapeHtml(l.name)} <span class="lang-level">(${escapeHtml(l.proficiency || "")})</span></span>`).join("")}
        </div>
      </div>` : "";
  
    const achievementsSection = resume.achievements?.length > 0 ? `
      <div class="section">
        <div class="section-title">ACHIEVEMENTS</div>
        <div class="section-divider"></div>
        ${resume.achievements.map((a) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(a.title || "")}</div>
                <div class="entry-subtitle">${escapeHtml(a.issuer || a.organization || "")}</div>
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.description ? `<div class="entry-desc"><div class="bullet">${escapeHtml(a.description)}</div></div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    const trainingSection = resume.training?.length > 0 ? `
      <div class="section">
        <div class="section-title">TRAINING & WORKSHOPS</div>
        <div class="section-divider"></div>
        ${resume.training.map((t) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <div class="entry-title">${escapeHtml(t.title || "")}</div>
                <div class="entry-subtitle">${escapeHtml(t.organization || "")}</div>
              </div>
              <div class="entry-date">${escapeHtml(t.date || "")}</div>
            </div>
          </div>`).join("")}
      </div>` : "";
  
    const interestsSection = resume.interests?.length > 0 ? `
      <div class="section">
        <div class="section-title">INTERESTS</div>
        <div class="section-divider"></div>
        <div class="skills-wrap">
          ${resume.interests.map((i) => `<span class="skill-tag">${escapeHtml(i.name)}</span>`).join("")}
        </div>
      </div>` : "";
  
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 11px;
        color: #1a1a1a;
        background: #ffffff;
        padding: 36px 44px;
        line-height: 1.5;
      }
      .header {
        text-align: center;
        margin-bottom: 18px;
        padding-bottom: 14px;
        border-bottom: 2px solid #1a1a1a;
      }
      .header-name {
        font-size: 26px;
        font-weight: bold;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: #1a1a1a;
        margin-bottom: 4px;
      }
      .header-title {
        font-size: 12px;
        color: #555;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .header-contact { font-size: 10px; color: #444; }
      .section { margin-bottom: 16px; }
      .section-title {
        font-size: 10px;
        font-weight: bold;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #1a1a1a;
        margin-bottom: 4px;
      }
      .section-divider {
        height: 1.5px;
        background-color: #1a1a1a;
        margin-bottom: 10px;
      }
      .summary-text { font-size: 11px; color: #333; line-height: 1.6; }
      .entry { margin-bottom: 10px; }
      .entry-header { display: flex; justify-content: space-between; align-items: flex-start; }
      .entry-left { flex: 1; }
      .entry-title { font-size: 12px; font-weight: bold; color: #1a1a1a; }
      .entry-subtitle { font-size: 10.5px; color: #555; font-style: italic; margin-top: 1px; }
      .entry-grade { font-size: 10px; color: #666; margin-top: 1px; }
      .entry-date { font-size: 10px; color: #555; white-space: nowrap; margin-left: 12px; padding-top: 2px; }
      .entry-desc { margin-top: 5px; }
      .bullet { font-size: 10.5px; color: #333; margin-bottom: 2px; padding-left: 4px; }
      .entry-link { font-size: 10px; color: #2563eb; margin-top: 3px; }
      .skills-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
      .skill-tag {
        font-size: 10px; color: #333;
        border: 1px solid #ccc; border-radius: 3px;
        padding: 2px 8px; background: #f9f9f9;
      }
      .lang-level { color: #777; font-size: 9px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="header-name">${name}</div>
      ${jobTitle ? `<div class="header-title">${jobTitle}</div>` : ""}
      <div class="header-contact">${contactLine}</div>
    </div>
    ${summarySection}
    ${experienceSection}
    ${educationSection}
    ${skillsSection}
    ${projectsSection}
    ${certsSection}
    ${achievementsSection}
    ${trainingSection}
    ${languagesSection}
    ${interestsSection}
  </body>
  </html>`;
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 3 — classic-pro
// Style: Image 3 (Ahmed Hassan) — bold caps headers + full underline,
//        dashes for bullets, inline pipe skills, company bold + inline role
// ─────────────────────────────────────────────────────────────────────────────
function buildClassicPro(resume) {
    const p = resume.personal || {};
    const name     = escapeHtml(p.fullName)  || "Your Name";
    const jobTitle = escapeHtml(p.jobTitle)  || "";
    const email    = escapeHtml(p.email)     || "";
    const phone    = escapeHtml(p.phone)     || "";
    const location = escapeHtml(p.location)  || "";
    const linkedin = escapeHtml(p.linkedin)  || "";
    const github   = escapeHtml(p.github)    || "";
    const website  = escapeHtml(p.website)   || "";
    const summary  = escapeHtml(p.summary)   || "";
  
    const contactParts = [email, phone, location, linkedin, github, website].filter(Boolean);
    const contactLine  = contactParts.join(" &nbsp;|&nbsp; ");
  
    // ── Summary ──
    const summarySection = summary ? `
      <div class="section">
        <div class="section-header">SUMMARY</div>
        <p class="summary-text">${summary}</p>
      </div>` : "";
  
    // ── Experience ──
    const experienceSection = resume.experience?.length > 0 ? `
      <div class="section">
        <div class="section-header">PROFESSIONAL EXPERIENCE</div>
        ${resume.experience.map((exp) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(exp.company || exp.companyName || "")},</span>
                <span class="entry-role"> ${escapeHtml(exp.role || exp.title || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
                ${exp.location ? `<br/>${escapeHtml(exp.location)}` : ""}
              </div>
            </div>
            ${exp.description ? `<div class="entry-desc">${exp.description.split("\n").filter(l => l.trim()).map(l => `<div class="dash-bullet">- ${l.replace(/^•\s*/, "")}</div>`).join("")}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Education ──
    const educationSection = resume.education?.length > 0 ? `
      <div class="section">
        <div class="section-header">EDUCATION</div>
        ${resume.education.map((edu) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(edu.degree || "")}${edu.field ? `, ${escapeHtml(edu.field)}` : ""},</span>
                <span class="entry-role"> ${escapeHtml(edu.institution || edu.school || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
                ${edu.location ? `<br/>${escapeHtml(edu.location)}` : ""}
              </div>
            </div>
            ${edu.grade ? `<div class="dash-bullet">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Skills (inline pipe) ──
    const skillsSection = resume.skills?.length > 0 ? `
      <div class="section">
        <div class="section-header">SKILLS</div>
        <p class="pipe-line">${resume.skills.map(s => escapeHtml(s.name)).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";
  
    // ── Projects ──
    const projectsSection = resume.projects?.length > 0 ? `
      <div class="section">
        <div class="section-header">PROJECTS</div>
        ${resume.projects.map((proj) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(proj.title || "")}</span>
                ${proj.role ? `<span class="entry-role">, ${escapeHtml(proj.role)}</span>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.technologies ? `<div class="dash-bullet">Technologies: ${escapeHtml(proj.technologies)}</div>` : ""}
            ${proj.description ? `<div class="entry-desc">${proj.description.split("\n").filter(l => l.trim()).map(l => `<div class="dash-bullet">- ${l.replace(/^•\s*/, "")}</div>`).join("")}</div>` : ""}
            ${proj.url ? `<div class="dash-bullet">URL: ${escapeHtml(proj.url)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Certifications (inline pipe) ──
    const certsSection = resume.certifications?.length > 0 ? `
      <div class="section">
        <div class="section-header">CERTIFICATIONS</div>
        <p class="pipe-line">${resume.certifications.map(c => escapeHtml(c.name)).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";
  
    // ── Languages (inline pipe) ──
    const languagesSection = resume.languages?.length > 0 ? `
      <div class="section">
        <div class="section-header">LANGUAGES</div>
        <p class="pipe-line">${resume.languages.map(l => `<strong>${escapeHtml(l.name)}</strong>: ${escapeHtml(l.proficiency || "")}`).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";
  
    // ── Achievements ──
    const achievementsSection = resume.achievements?.length > 0 ? `
      <div class="section">
        <div class="section-header">ACHIEVEMENTS</div>
        ${resume.achievements.map((a) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(a.title || "")}</span>
                ${a.issuer ? `<span class="entry-role">, ${escapeHtml(a.issuer)}</span>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.description ? `<div class="dash-bullet">- ${escapeHtml(a.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Training ──
    const trainingSection = resume.training?.length > 0 ? `
      <div class="section">
        <div class="section-header">TRAINING & WORKSHOPS</div>
        ${resume.training.map((t) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(t.title || "")}</span>
                ${t.organization ? `<span class="entry-role">, ${escapeHtml(t.organization)}</span>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(t.date || "")}</div>
            </div>
          </div>`).join("")}
      </div>` : "";
  
    // ── Interests ──
    const interestsSection = resume.interests?.length > 0 ? `
      <div class="section">
        <div class="section-header">INTERESTS</div>
        <p class="pipe-line">${resume.interests.map(i => escapeHtml(i.name)).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";
  
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
  
      body {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 11px;
        color: #1a1a1a;
        background: #ffffff;
        padding: 32px 40px;
        line-height: 1.5;
      }
  
      /* ── Header ── */
      .header {
        margin-bottom: 14px;
        padding-bottom: 8px;
      }
      .header-top {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 4px;
      }
      .header-name {
        font-size: 22px;
        font-weight: bold;
        color: #1a1a1a;
      }
      .header-title {
        font-size: 13px;
        font-style: italic;
        color: #444;
      }
      .header-contact {
        font-size: 10px;
        color: #444;
        margin-bottom: 8px;
      }
      .header-divider {
        height: 1.5px;
        background: #1a1a1a;
      }
  
      /* ── Section ── */
      .section { margin-bottom: 13px; }
  
      .section-header {
        font-size: 10.5px;
        font-weight: bold;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: #1a1a1a;
        border-bottom: 1.5px solid #1a1a1a;
        padding-bottom: 2px;
        margin-bottom: 7px;
      }
  
      /* ── Summary ── */
      .summary-text {
        font-size: 11px;
        color: #333;
        line-height: 1.6;
      }
  
      /* ── Entry ── */
      .entry { margin-bottom: 8px; }
  
      .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .entry-left { flex: 1; }
  
      .entry-company {
        font-size: 11.5px;
        font-weight: bold;
        color: #1a1a1a;
      }
      .entry-role {
        font-size: 11px;
        font-style: italic;
        color: #444;
      }
      .entry-date {
        font-size: 10px;
        color: #555;
        white-space: nowrap;
        margin-left: 10px;
        text-align: right;
        padding-top: 2px;
      }
      .entry-desc { margin-top: 3px; }
      .dash-bullet {
        font-size: 10.5px;
        color: #333;
        margin-bottom: 2px;
        padding-left: 6px;
      }
  
      /* ── Pipe line (skills, languages, certs) ── */
      .pipe-line {
        font-size: 10.5px;
        color: #333;
        line-height: 1.8;
      }
    </style>
  </head>
  <body>
  
    <div class="header">
      <div class="header-top">
        <span class="header-name">${name}</span>
        ${jobTitle ? `<span class="header-title">${jobTitle}</span>` : ""}
      </div>
      <div class="header-contact">${contactLine}</div>
      <div class="header-divider"></div>
    </div>
  
    ${summarySection}
    ${experienceSection}
    ${educationSection}
    ${skillsSection}
    ${projectsSection}
    ${certsSection}
    ${achievementsSection}
    ${trainingSection}
    ${languagesSection}
    ${interestsSection}
  
  </body>
  </html>`;
  }
// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 4 — classic-compact
// Style: Image 5 (Lena Hoffmann) — centered name, icons in contact,
//        bold caps + underline headers, dash bullets, pipe skills, dense layout
// ─────────────────────────────────────────────────────────────────────────────
function buildClassicCompact(resume) {
    const p = resume.personal || {};
    const name     = escapeHtml(p.fullName)  || "Your Name";
    const jobTitle = escapeHtml(p.jobTitle)  || "";
    const email    = escapeHtml(p.email)     || "";
    const phone    = escapeHtml(p.phone)     || "";
    const location = escapeHtml(p.location)  || "";
    const linkedin = escapeHtml(p.linkedin)  || "";
    const github   = escapeHtml(p.github)    || "";
    const website  = escapeHtml(p.website)   || "";
    const summary  = escapeHtml(p.summary)   || "";
  
    // contact with icons
    const contactParts = [
      location ? `&#9679; ${location}` : "",
      email    ? `&#9993; ${email}`    : "",
      phone    ? `&#9742; ${phone}`    : "",
      linkedin ? `&#128279; ${linkedin}` : "",
      github   ? `&#128279; ${github}`   : "",
      website  ? `&#128279; ${website}`  : "",
    ].filter(Boolean);
    const contactLine = contactParts.join(" &nbsp;&nbsp; ");
  
    // ── Summary ──
    const summarySection = summary ? `
      <div class="section">
        <div class="section-header">SUMMARY</div>
        <p class="summary-text">${summary}</p>
      </div>` : "";
  
    // ── Experience ──
    const experienceSection = resume.experience?.length > 0 ? `
      <div class="section">
        <div class="section-header">PROFESSIONAL EXPERIENCE</div>
        ${resume.experience.map((exp) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(exp.company || exp.companyName || "")},</span>
                <span class="entry-role"> ${escapeHtml(exp.role || exp.title || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
                ${exp.location ? ` | ${escapeHtml(exp.location)}` : ""}
              </div>
            </div>
            ${exp.description ? `<div class="entry-desc">${exp.description.split("\n").filter(l => l.trim()).map(l => `<div class="dash-bullet">- ${l.replace(/^•\s*/, "")}</div>`).join("")}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Education ──
    const educationSection = resume.education?.length > 0 ? `
      <div class="section">
        <div class="section-header">EDUCATION</div>
        ${resume.education.map((edu) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(edu.institution || edu.school || "")},</span>
                <span class="entry-role"> ${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
                ${edu.location ? ` | ${escapeHtml(edu.location)}` : ""}
              </div>
            </div>
            ${edu.grade ? `<div class="dash-bullet">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Skills (inline pipe, multiline) ──
    const skillsSection = resume.skills?.length > 0 ? `
      <div class="section">
        <div class="section-header">SKILLS</div>
        <p class="pipe-line">${resume.skills.map(s => escapeHtml(s.name)).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";
  
    // ── Projects ──
    const projectsSection = resume.projects?.length > 0 ? `
      <div class="section">
        <div class="section-header">PROJECTS</div>
        ${resume.projects.map((proj) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(proj.title || "")}</span>
                ${proj.role ? `<span class="entry-role">, ${escapeHtml(proj.role)}</span>` : ""}
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.technologies ? `<div class="dash-bullet">Technologies: ${escapeHtml(proj.technologies)}</div>` : ""}
            ${proj.description ? `<div class="entry-desc">${proj.description.split("\n").filter(l => l.trim()).map(l => `<div class="dash-bullet">- ${l.replace(/^•\s*/, "")}</div>`).join("")}</div>` : ""}
            ${proj.url ? `<div class="dash-bullet">URL: ${escapeHtml(proj.url)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Certifications (pipe) ──
    const certsSection = resume.certifications?.length > 0 ? `
      <div class="section">
        <div class="section-header">CERTIFICATIONS</div>
        <p class="pipe-line">${resume.certifications.map(c => escapeHtml(c.name)).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";
  
    // ── Languages ──
    const languagesSection = resume.languages?.length > 0 ? `
      <div class="section">
        <div class="section-header">LANGUAGES</div>
        <p class="pipe-line">${resume.languages.map(l => `<strong>${escapeHtml(l.name)}</strong> (${escapeHtml(l.proficiency || "")})`).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";
  
    // ── Achievements ──
    const achievementsSection = resume.achievements?.length > 0 ? `
      <div class="section">
        <div class="section-header">ACHIEVEMENTS</div>
        ${resume.achievements.map((a) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(a.title || "")}</span>
                ${a.issuer ? `<span class="entry-role">, ${escapeHtml(a.issuer)}</span>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.description ? `<div class="dash-bullet">- ${escapeHtml(a.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Training ──
    const trainingSection = resume.training?.length > 0 ? `
      <div class="section">
        <div class="section-header">TRAINING & WORKSHOPS</div>
        ${resume.training.map((t) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-company">${escapeHtml(t.title || "")}</span>
                ${t.organization ? `<span class="entry-role">, ${escapeHtml(t.organization)}</span>` : ""}
              </div>
              <div class="entry-date">${escapeHtml(t.date || "")}</div>
            </div>
          </div>`).join("")}
      </div>` : "";
  
    // ── Interests ──
    const interestsSection = resume.interests?.length > 0 ? `
      <div class="section">
        <div class="section-header">INTERESTS</div>
        <p class="pipe-line">${resume.interests.map(i => escapeHtml(i.name)).join(" &nbsp;|&nbsp; ")}</p>
      </div>` : "";
  
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
  
      body {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 10.5px;
        color: #1a1a1a;
        background: #ffffff;
        padding: 28px 36px;
        line-height: 1.4;
      }
  
      /* ── Header ── */
      .header {
        text-align: center;
        margin-bottom: 12px;
        padding-bottom: 8px;
      }
      .header-name {
        font-size: 22px;
        font-weight: bold;
        color: #1a1a1a;
        letter-spacing: 0.5px;
        margin-bottom: 2px;
      }
      .header-title {
        font-size: 11px;
        font-style: italic;
        color: #555;
        margin-bottom: 5px;
      }
      .header-contact {
        font-size: 9.5px;
        color: #444;
        margin-bottom: 8px;
      }
      .header-divider {
        height: 1.5px;
        background: #1a1a1a;
      }
  
      /* ── Section ── */
      .section { margin-bottom: 11px; }
  
      .section-header {
        font-size: 10px;
        font-weight: bold;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: #1a1a1a;
        border-bottom: 1.5px solid #1a1a1a;
        padding-bottom: 2px;
        margin-bottom: 6px;
      }
  
      /* ── Summary ── */
      .summary-text {
        font-size: 10.5px;
        color: #333;
        line-height: 1.5;
      }
  
      /* ── Entry ── */
      .entry { margin-bottom: 6px; }
  
      .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .entry-left { flex: 1; }
  
      .entry-company {
        font-size: 11px;
        font-weight: bold;
        color: #1a1a1a;
      }
      .entry-role {
        font-size: 10.5px;
        font-style: italic;
        color: #444;
      }
      .entry-date {
        font-size: 9.5px;
        color: #555;
        white-space: nowrap;
        margin-left: 10px;
        text-align: right;
        padding-top: 1px;
      }
      .entry-desc { margin-top: 2px; }
      .dash-bullet {
        font-size: 10px;
        color: #333;
        margin-bottom: 1px;
        padding-left: 6px;
      }
  
      /* ── Pipe line ── */
      .pipe-line {
        font-size: 10px;
        color: #333;
        line-height: 1.7;
      }
    </style>
  </head>
  <body>
  
    <div class="header">
      <div class="header-name">${name}</div>
      ${jobTitle ? `<div class="header-title">${jobTitle}</div>` : ""}
      <div class="header-contact">${contactLine}</div>
      <div class="header-divider"></div>
    </div>
  
    ${summarySection}
    ${experienceSection}
    ${educationSection}
    ${skillsSection}
    ${projectsSection}
    ${certsSection}
    ${achievementsSection}
    ${trainingSection}
    ${languagesSection}
    ${interestsSection}
  
  </body>
  </html>`;
  }

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 5 — classic-ats
// Style: Image 2 (James White) — centered name, title-case headers,
//        simple underline, bullet skills single col, zero decoration, pure ATS
// ─────────────────────────────────────────────────────────────────────────────
function buildClassicAts(resume) {
    const p = resume.personal || {};
    const name     = escapeHtml(p.fullName)  || "Your Name";
    const jobTitle = escapeHtml(p.jobTitle)  || "";
    const email    = escapeHtml(p.email)     || "";
    const phone    = escapeHtml(p.phone)     || "";
    const location = escapeHtml(p.location)  || "";
    const linkedin = escapeHtml(p.linkedin)  || "";
    const github   = escapeHtml(p.github)    || "";
    const website  = escapeHtml(p.website)   || "";
    const summary  = escapeHtml(p.summary)   || "";
  
    const contactParts = [location, email, phone, linkedin, github, website].filter(Boolean);
    const contactLine  = contactParts.join(" | ");
  
    // ── Summary ──
    const summarySection = summary ? `
      <div class="section">
        <div class="section-header">Summary</div>
        <p class="summary-text">${summary}</p>
      </div>` : "";
  
    // ── Experience ──
    const experienceSection = resume.experience?.length > 0 ? `
      <div class="section">
        <div class="section-header">Professional Experience</div>
        ${resume.experience.map((exp) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(exp.role || exp.title || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(exp.startDate || "")}${exp.startDate ? " – " : ""}${exp.current ? "Present" : escapeHtml(exp.endDate || "")}
                ${exp.location ? ` | ${escapeHtml(exp.location)}` : ""}
              </div>
            </div>
            <div class="entry-subtitle">${escapeHtml(exp.company || exp.companyName || "")}</div>
            ${exp.description ? `<div class="entry-desc">${exp.description.split("\n").filter(l => l.trim()).map(l => `<div class="bullet">• ${l.replace(/^•\s*/, "")}</div>`).join("")}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Education ──
    const educationSection = resume.education?.length > 0 ? `
      <div class="section">
        <div class="section-header">Education</div>
        ${resume.education.map((edu) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(edu.startDate || "")}${edu.startDate ? " – " : ""}${edu.current ? "Present" : escapeHtml(edu.endDate || "")}
                ${edu.location ? ` | ${escapeHtml(edu.location)}` : ""}
              </div>
            </div>
            <div class="entry-subtitle">${escapeHtml(edu.institution || edu.school || "")}</div>
            ${edu.grade ? `<div class="entry-grade">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Skills (single col bullets) ──
    const skillsSection = resume.skills?.length > 0 ? `
      <div class="section">
        <div class="section-header">Skills</div>
        <div class="skills-col">
          ${resume.skills.map(s => `<div class="bullet">• ${escapeHtml(s.name)}</div>`).join("")}
        </div>
      </div>` : "";
  
    // ── Projects ──
    const projectsSection = resume.projects?.length > 0 ? `
      <div class="section">
        <div class="section-header">Projects</div>
        ${resume.projects.map((proj) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(proj.title || "")}</span>
              </div>
              <div class="entry-date">
                ${escapeHtml(proj.startDate || "")}${proj.startDate ? " – " : ""}${proj.current ? "Present" : escapeHtml(proj.endDate || "")}
              </div>
            </div>
            ${proj.role || proj.technologies ? `<div class="entry-subtitle">${escapeHtml(proj.role || "")}${proj.technologies ? ` • ${escapeHtml(proj.technologies)}` : ""}</div>` : ""}
            ${proj.description ? `<div class="entry-desc">${proj.description.split("\n").filter(l => l.trim()).map(l => `<div class="bullet">• ${l.replace(/^•\s*/, "")}</div>`).join("")}</div>` : ""}
            ${proj.url ? `<div class="entry-subtitle">${escapeHtml(proj.url)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Certifications ──
    const certsSection = resume.certifications?.length > 0 ? `
      <div class="section">
        <div class="section-header">Certificates</div>
        ${resume.certifications.map((cert) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(cert.name || "")}</span>
              </div>
              <div class="entry-date">${escapeHtml(cert.issueDate || "")}</div>
            </div>
            <div class="entry-subtitle">${escapeHtml(cert.issuer || cert.organization || "")}</div>
          </div>`).join("")}
      </div>` : "";
  
    // ── Languages ──
    const languagesSection = resume.languages?.length > 0 ? `
      <div class="section">
        <div class="section-header">Languages</div>
        <div class="skills-col">
          ${resume.languages.map(l => `<div class="bullet">• ${escapeHtml(l.name)}${l.proficiency ? ` — ${escapeHtml(l.proficiency)}` : ""}</div>`).join("")}
        </div>
      </div>` : "";
  
    // ── Achievements ──
    const achievementsSection = resume.achievements?.length > 0 ? `
      <div class="section">
        <div class="section-header">Achievements</div>
        ${resume.achievements.map((a) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(a.title || "")}</span>
              </div>
              <div class="entry-date">${escapeHtml(a.date || "")}</div>
            </div>
            ${a.issuer ? `<div class="entry-subtitle">${escapeHtml(a.issuer)}</div>` : ""}
            ${a.description ? `<div class="bullet">• ${escapeHtml(a.description)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Training ──
    const trainingSection = resume.training?.length > 0 ? `
      <div class="section">
        <div class="section-header">Training & Workshops</div>
        ${resume.training.map((t) => `
          <div class="entry">
            <div class="entry-header">
              <div class="entry-left">
                <span class="entry-title">${escapeHtml(t.title || "")}</span>
              </div>
              <div class="entry-date">${escapeHtml(t.date || "")}</div>
            </div>
            ${t.organization ? `<div class="entry-subtitle">${escapeHtml(t.organization)}</div>` : ""}
          </div>`).join("")}
      </div>` : "";
  
    // ── Interests ──
    const interestsSection = resume.interests?.length > 0 ? `
      <div class="section">
        <div class="section-header">Interests</div>
        <div class="skills-col">
          ${resume.interests.map(i => `<div class="bullet">• ${escapeHtml(i.name)}</div>`).join("")}
        </div>
      </div>` : "";
  
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
  
      body {
        font-family: 'Arial', 'Helvetica', sans-serif;
        font-size: 11px;
        color: #1a1a1a;
        background: #ffffff;
        padding: 32px 40px;
        line-height: 1.5;
      }
  
      /* ── Header ── */
      .header {
        text-align: center;
        margin-bottom: 16px;
      }
      .header-name {
        font-size: 24px;
        font-weight: bold;
        color: #1a1a1a;
        margin-bottom: 3px;
      }
      .header-title {
        font-size: 12px;
        font-style: italic;
        color: #555;
        margin-bottom: 5px;
      }
      .header-contact {
        font-size: 10px;
        color: #444;
      }
  
      /* ── Section ── */
      .section { margin-bottom: 14px; }
  
      .section-header {
        font-size: 12px;
        font-weight: bold;
        color: #1a1a1a;
        border-bottom: 1px solid #1a1a1a;
        padding-bottom: 2px;
        margin-bottom: 8px;
      }
  
      /* ── Summary ── */
      .summary-text {
        font-size: 11px;
        color: #333;
        line-height: 1.6;
      }
  
      /* ── Entry ── */
      .entry { margin-bottom: 9px; }
  
      .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .entry-left { flex: 1; }
  
      .entry-title {
        font-size: 11.5px;
        font-weight: bold;
        color: #1a1a1a;
      }
      .entry-subtitle {
        font-size: 10.5px;
        font-style: italic;
        color: #555;
        margin-top: 1px;
      }
      .entry-grade {
        font-size: 10px;
        color: #666;
        margin-top: 1px;
      }
      .entry-date {
        font-size: 10px;
        color: #555;
        white-space: nowrap;
        margin-left: 10px;
        padding-top: 2px;
        text-align: right;
      }
      .entry-desc { margin-top: 4px; }
      .bullet {
        font-size: 10.5px;
        color: #333;
        margin-bottom: 2px;
        padding-left: 4px;
      }
  
      /* ── Skills single col ── */
      .skills-col { }
    </style>
  </head>
  <body>
  
    <div class="header">
      <div class="header-name">${name}</div>
      ${jobTitle ? `<div class="header-title">${jobTitle}</div>` : ""}
      <div class="header-contact">${contactLine}</div>
    </div>
  
    ${summarySection}
    ${experienceSection}
    ${educationSection}
    ${skillsSection}
    ${projectsSection}
    ${certsSection}
    ${achievementsSection}
    ${trainingSection}
    ${languagesSection}
    ${interestsSection}
  
  </body>
  </html>`;
  }


  // ROUTER — getTemplate(templateId, resume)
  // ─────────────────────────────────────────────────────────────────────────────
  export function getTemplate(templateId, resume) {
    switch (templateId) {
      case "classic-clean": return buildClassicClean(resume);
      case "classic-bold":  return buildClassicBold(resume);
      // coming soon:
       case "classic-pro":     return buildClassicPro(resume);
      case "classic-compact": return buildClassicCompact(resume);
      case "classic-ats":     return buildClassicAts(resume);
      default:              return buildClassicClean(resume);
    }
  }