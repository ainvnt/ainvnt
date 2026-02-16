(() => {
    const JOBS_API_URL = 'https://jsonkeeper.com/b/OZCGU';
    const MAX_SKILLS_ON_CARD = 3;
    let jobsDataPromise = null;

    function sendAnalyticsEvent(eventName, eventParams = {}) {
        if (typeof window.trackAnalyticsEvent === 'function') {
            window.trackAnalyticsEvent(eventName, eventParams);
        }
    }

    function cleanArray(value) {
        if (!Array.isArray(value)) {
            return [];
        }
        return value
            .filter(item => typeof item === 'string' && item.trim())
            .map(item => item.trim());
    }

    function getJobsData() {
        if (!jobsDataPromise) {
            jobsDataPromise = fetch(JOBS_API_URL, {
                headers: {
                    Accept: 'application/json'
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch jobs (${response.status})`);
                }
                return response.json();
            });
        }
        return jobsDataPromise;
    }

    function createStatusMessage(text) {
        const message = document.createElement('p');
        message.className = 'role-status';
        message.textContent = text;
        return message;
    }

    function truncateText(text, maxLength) {
        if (typeof text !== 'string' || !text.trim()) {
            return '';
        }

        if (text.length <= maxLength) {
            return text.trim();
        }

        return `${text.slice(0, maxLength).trimEnd()}...`;
    }

    function buildCardTags(job) {
        const skillTags = cleanArray(job.requiredSkills);
        const visibleSkills = skillTags.slice(0, MAX_SKILLS_ON_CARD);
        const hiddenSkills = Math.max(0, skillTags.length - MAX_SKILLS_ON_CARD);

        if (hiddenSkills > 0) {
            visibleSkills.push(`+${hiddenSkills} more skills`);
        }

        return visibleSkills;
    }

    function createTagContainer(tags) {
        const container = document.createElement('div');
        container.className = 'role-tags';

        tags.forEach(tagText => {
            const tag = document.createElement('span');
            tag.textContent = tagText;
            container.appendChild(tag);
        });

        return container;
    }

    function buildRoleCard(job, fallbackModes) {
        const title = typeof job.title === 'string' && job.title.trim() ? job.title.trim() : 'Open role';
        const type = typeof job.type === 'string' && job.type.trim() ? job.type.trim() : 'Role';
        const jobId = typeof job.id === 'string' && job.id.trim() ? job.id.trim() : '';
        const department = typeof job.department === 'string' && job.department.trim() ? job.department.trim() : '';
        const modes = cleanArray(job.mode);
        const fallbackModeTags = cleanArray(fallbackModes);
        const detailsHref = jobId
            ? `job-details.html?id=${encodeURIComponent(jobId)}`
            : 'careers.html#open-roles';
        const analyticsPayload = {
            content_type: 'job_opening',
            item_id: jobId || 'unknown_job',
            item_name: title
        };

        function trackRoleSelection() {
            sendAnalyticsEvent('select_content', analyticsPayload);
        }

        const card = document.createElement('article');
        card.className = 'role-card role-card--interactive';
        card.tabIndex = 0;
        card.setAttribute('role', 'link');
        card.setAttribute('aria-label', `View details for ${title}`);

        const header = document.createElement('div');
        header.className = 'role-header';

        const titleWrap = document.createElement('div');
        titleWrap.className = 'role-title-wrap';

        const heading = document.createElement('h3');
        heading.className = 'role-title';
        heading.textContent = title;

        const identity = [jobId, department].filter(Boolean).join(' | ');
        if (identity) {
            const subhead = document.createElement('p');
            subhead.className = 'role-subhead';
            subhead.textContent = identity;
            titleWrap.appendChild(subhead);
        }
        titleWrap.appendChild(heading);

        const badge = document.createElement('span');
        badge.className = 'role-type';
        badge.textContent = type;

        header.appendChild(titleWrap);
        header.appendChild(badge);

        const description = document.createElement('p');
        description.className = 'role-description';
        description.textContent = truncateText(job.description, 140) || 'View this role for complete responsibilities and expectations.';

        const activeModes = modes.length ? modes : fallbackModeTags;
        const metaItems = [job.experienceLevel, job.duration]
            .filter(item => typeof item === 'string' && item.trim())
            .map(item => item.trim())
            .concat(activeModes.length ? [`Mode: ${activeModes.join(' / ')}`] : []);

        const meta = document.createElement('div');
        meta.className = 'role-meta';
        metaItems.forEach(item => {
            const chip = document.createElement('span');
            chip.textContent = item;
            meta.appendChild(chip);
        });

        const tags = createTagContainer(buildCardTags(job));
        const skillsLabel = document.createElement('p');
        skillsLabel.className = 'role-skill-label';
        skillsLabel.textContent = 'Key skills';

        const actions = document.createElement('div');
        actions.className = 'role-card-actions';

        const learnMoreLink = document.createElement('a');
        learnMoreLink.className = 'btn btn-secondary role-learn-more';
        learnMoreLink.href = detailsHref;
        learnMoreLink.textContent = 'View details';
        learnMoreLink.addEventListener('click', () => {
            trackRoleSelection();
        });
        actions.appendChild(learnMoreLink);

        card.addEventListener('click', event => {
            if (event.target.closest('a')) {
                return;
            }
            trackRoleSelection();
            window.location.href = detailsHref;
        });

        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                trackRoleSelection();
                window.location.href = detailsHref;
            }
        });

        card.appendChild(header);
        card.appendChild(description);
        if (meta.childElementCount > 0) {
            card.appendChild(meta);
        }
        if (tags.childElementCount > 0) {
            card.appendChild(skillsLabel);
            card.appendChild(tags);
        }
        card.appendChild(actions);

        return card;
    }

    async function initCareersRoles() {
        const roleGrid = document.querySelector('[data-role-grid]');
        if (!roleGrid) {
            return;
        }

        roleGrid.textContent = '';
        roleGrid.appendChild(createStatusMessage('Loading open roles...'));

        const rolesNote = document.querySelector('[data-roles-note]');

        try {
            const data = await getJobsData();
            const jobs = Array.isArray(data.jobOpenings) ? data.jobOpenings : [];
            const fallbackModes = cleanArray(data.location);
            const companyName = typeof data.company === 'string' && data.company.trim() ? data.company.trim() : 'Ainvnt';

            roleGrid.textContent = '';

            if (!jobs.length) {
                roleGrid.appendChild(createStatusMessage('No open roles are listed right now.'));
                return;
            }

            const cardsFragment = document.createDocumentFragment();
            jobs.forEach(job => {
                cardsFragment.appendChild(buildRoleCard(job, fallbackModes));
            });
            roleGrid.appendChild(cardsFragment);

            if (rolesNote) {
                rolesNote.textContent = `${jobs.length} role${jobs.length === 1 ? '' : 's'} currently open at ${companyName}.`;
            }
        } catch (error) {
            console.error('Unable to load open roles.', error);
            roleGrid.textContent = '';
            roleGrid.appendChild(createStatusMessage('Unable to load roles right now. Please try again later.'));
        }
    }

    function createBackButton() {
        const backButton = document.createElement('a');
        backButton.className = 'btn btn-secondary';
        backButton.href = 'careers.html#open-roles';
        backButton.textContent = 'Back to open roles';
        return backButton;
    }

    function createDetailBlock(title, contentNode) {
        const block = document.createElement('section');
        block.className = 'job-detail-block';

        const heading = document.createElement('h3');
        heading.textContent = title;

        block.appendChild(heading);
        block.appendChild(contentNode);
        return block;
    }

    function createPillCloud(items, className) {
        const cloud = document.createElement('div');
        cloud.className = className;

        items.forEach(item => {
            const chip = document.createElement('span');
            chip.textContent = item;
            cloud.appendChild(chip);
        });

        return cloud;
    }

    function createFactRow(label, value) {
        if (typeof value !== 'string' || !value.trim()) {
            return null;
        }

        const row = document.createElement('div');
        row.className = 'job-detail-fact';

        const term = document.createElement('dt');
        term.textContent = label;

        const detail = document.createElement('dd');
        detail.textContent = value.trim();

        row.appendChild(term);
        row.appendChild(detail);
        return row;
    }

    function updateJobPageContext(titleText, subtitleText, companyName) {
        const pageHeading = document.querySelector('[data-job-page-title]');
        if (pageHeading) {
            pageHeading.textContent = titleText;
        }

        const pageSubtitle = document.querySelector('[data-job-page-subtitle]');
        if (pageSubtitle) {
            pageSubtitle.textContent = subtitleText;
        }

        document.title = `${titleText} | Careers at ${companyName}`;
    }

    function renderJobDetailError(container, message) {
        container.textContent = '';

        const errorCard = document.createElement('div');
        errorCard.className = 'job-detail-error-card';
        errorCard.appendChild(createStatusMessage(message));

        const actions = document.createElement('div');
        actions.className = 'job-detail-actions';
        actions.appendChild(createBackButton());
        errorCard.appendChild(actions);

        container.appendChild(errorCard);
        updateJobPageContext('Job details', 'This role could not be loaded right now. Please try another opening.', 'Ainvnt');
    }

    function renderJobDetail(container, job, data) {
        container.textContent = '';
        const titleText = typeof job.title === 'string' && job.title.trim() ? job.title.trim() : 'Job details';
        const jobType = typeof job.type === 'string' && job.type.trim() ? job.type.trim() : 'Role';
        const companyName = typeof data.company === 'string' && data.company.trim() ? data.company.trim() : 'Ainvnt';
        const descriptionText = typeof job.description === 'string' && job.description.trim()
            ? job.description.trim()
            : 'No description available for this role yet.';
        const descriptionLead = truncateText(descriptionText, 180);

        const jobId = typeof job.id === 'string' && job.id.trim() ? job.id.trim() : 'N/A';
        const department = typeof job.department === 'string' && job.department.trim() ? job.department.trim() : 'General';
        const experience = typeof job.experienceLevel === 'string' && job.experienceLevel.trim() ? job.experienceLevel.trim() : 'Not specified';
        const duration = typeof job.duration === 'string' && job.duration.trim() ? job.duration.trim() : 'Not specified';

        const workModes = cleanArray(job.mode);
        const globalLocations = cleanArray(data.location);
        const locationTags = workModes.length ? workModes : globalLocations;
        const locationLabel = locationTags.length ? locationTags.join(' / ') : 'Not specified';

        const skills = cleanArray(job.requiredSkills);

        const layout = document.createElement('div');
        layout.className = 'job-detail-layout-inner';

        const mainCard = document.createElement('article');
        mainCard.className = 'job-detail-main-card';

        const mainHeader = document.createElement('div');
        mainHeader.className = 'job-detail-main-head';

        const mainHeading = document.createElement('div');
        mainHeading.className = 'job-detail-main-heading';

        const mainId = document.createElement('p');
        mainId.className = 'job-detail-main-id';
        mainId.textContent = `${jobId} | ${department}`;

        const mainTitle = document.createElement('h2');
        mainTitle.className = 'job-detail-main-title';
        mainTitle.textContent = titleText;

        const mainLead = document.createElement('p');
        mainLead.className = 'job-detail-main-lead';
        mainLead.textContent = descriptionLead;

        const typeBadge = document.createElement('span');
        typeBadge.className = 'role-type';
        typeBadge.textContent = jobType;

        mainHeading.appendChild(mainId);
        mainHeading.appendChild(mainTitle);
        mainHeading.appendChild(mainLead);
        mainHeader.appendChild(mainHeading);
        mainHeader.appendChild(typeBadge);
        mainCard.appendChild(mainHeader);

        const chipValues = [experience, duration, `Mode: ${locationLabel}`];
        mainCard.appendChild(createPillCloud(chipValues, 'job-detail-chip-row'));

        const overview = document.createElement('p');
        overview.textContent = descriptionText;
        mainCard.appendChild(createDetailBlock('Role overview', overview));

        if (skills.length) {
            mainCard.appendChild(createDetailBlock('Required skills', createPillCloud(skills, 'job-detail-skill-cloud')));
        }

        if (locationTags.length) {
            mainCard.appendChild(createDetailBlock('Work setup', createPillCloud(locationTags, 'job-detail-mode-cloud')));
        }

        layout.appendChild(mainCard);

        const sideCard = document.createElement('aside');
        sideCard.className = 'job-detail-side-card';

        const sideTitle = document.createElement('h3');
        sideTitle.className = 'job-detail-side-title';
        sideTitle.textContent = 'Quick snapshot';
        sideCard.appendChild(sideTitle);

        const facts = document.createElement('dl');
        facts.className = 'job-detail-facts';

        [
            createFactRow('Company', companyName),
            createFactRow('Job ID', jobId),
            createFactRow('Department', department),
            createFactRow('Experience', experience),
            createFactRow('Duration', duration),
            createFactRow('Work mode', locationLabel)
        ].filter(Boolean).forEach(row => facts.appendChild(row));

        sideCard.appendChild(facts);

        const actions = document.createElement('div');
        actions.className = 'job-detail-actions';

        const applyButton = document.createElement('a');
        applyButton.className = 'btn btn-primary';
        applyButton.href = `contact.html?job=${encodeURIComponent(titleText)}&jobId=${encodeURIComponent(jobId)}`;
        applyButton.textContent = 'Apply for this role';
        applyButton.addEventListener('click', () => {
            sendAnalyticsEvent('select_content', {
                content_type: 'job_apply_cta',
                item_id: jobId,
                item_name: titleText
            });
        });

        actions.appendChild(applyButton);
        actions.appendChild(createBackButton());
        sideCard.appendChild(actions);

        const sideNote = document.createElement('p');
        sideNote.className = 'job-detail-note';
        sideNote.textContent = 'Need help deciding? Reach out and our team can guide you through the fit and interview process.';
        sideCard.appendChild(sideNote);

        layout.appendChild(sideCard);
        container.appendChild(layout);

        sendAnalyticsEvent('view_item', {
            item_category: 'job_opening',
            item_id: jobId,
            item_name: titleText
        });

        updateJobPageContext(titleText, descriptionLead, companyName);
    }

    async function initJobDetailsPage() {
        const detailsContainer = document.querySelector('[data-job-detail]');
        if (!detailsContainer) {
            return;
        }

        detailsContainer.textContent = '';
        detailsContainer.appendChild(createStatusMessage('Loading job details...'));

        const params = new URLSearchParams(window.location.search);
        const jobId = (params.get('id') || '').trim().toLowerCase();

        if (!jobId) {
            renderJobDetailError(detailsContainer, 'No job was selected.');
            return;
        }

        try {
            const data = await getJobsData();
            const jobs = Array.isArray(data.jobOpenings) ? data.jobOpenings : [];

            const job = jobs.find(item => {
                if (typeof item.id !== 'string') {
                    return false;
                }
                return item.id.trim().toLowerCase() === jobId;
            });

            if (!job) {
                renderJobDetailError(detailsContainer, 'This job is no longer available.');
                return;
            }

            renderJobDetail(detailsContainer, job, data);
        } catch (error) {
            console.error('Unable to load job details.', error);
            renderJobDetailError(detailsContainer, 'Unable to load job details right now. Please try again later.');
        }
    }

    initCareersRoles();
    initJobDetailsPage();
})();
