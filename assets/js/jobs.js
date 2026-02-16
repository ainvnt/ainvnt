(() => {
    const JOBS_API_URL = 'https://jsonkeeper.com/b/OZCGU';
    const MAX_SKILLS_ON_CARD = 4;
    let jobsDataPromise = null;

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

    function buildCardTags(job, fallbackModes) {
        const modeTags = cleanArray(job.mode);
        const skillTags = cleanArray(job.requiredSkills);
        const tags = [...new Set([...modeTags, ...skillTags.slice(0, MAX_SKILLS_ON_CARD)])];
        const hiddenSkills = Math.max(0, skillTags.length - MAX_SKILLS_ON_CARD);

        if (!tags.length) {
            return cleanArray(fallbackModes);
        }

        if (hiddenSkills > 0) {
            tags.push(`+${hiddenSkills} more skills`);
        }

        return tags;
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
        const detailsHref = jobId
            ? `job-details.html?id=${encodeURIComponent(jobId)}`
            : 'careers.html#open-roles';

        const card = document.createElement('article');
        card.className = 'role-card role-card--interactive';
        card.tabIndex = 0;
        card.setAttribute('role', 'link');
        card.setAttribute('aria-label', `View details for ${title}`);

        const header = document.createElement('div');
        header.className = 'role-header';

        const heading = document.createElement('h3');
        heading.textContent = title;

        const badge = document.createElement('span');
        badge.className = 'role-type';
        badge.textContent = type;

        header.appendChild(heading);
        header.appendChild(badge);

        const description = document.createElement('p');
        description.textContent = truncateText(job.description, 180) || 'View this role for complete responsibilities and expectations.';

        const metaItems = [job.department, job.experienceLevel, job.duration]
            .filter(item => typeof item === 'string' && item.trim())
            .map(item => item.trim());

        const meta = document.createElement('p');
        meta.className = 'role-meta';
        meta.textContent = metaItems.join(' | ');

        const tags = createTagContainer(buildCardTags(job, fallbackModes));

        const actions = document.createElement('div');
        actions.className = 'role-card-actions';

        const learnMoreLink = document.createElement('a');
        learnMoreLink.className = 'btn btn-secondary';
        learnMoreLink.href = detailsHref;
        learnMoreLink.textContent = 'Learn more';
        actions.appendChild(learnMoreLink);

        card.addEventListener('click', event => {
            if (event.target.closest('a')) {
                return;
            }
            window.location.href = detailsHref;
        });

        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                window.location.href = detailsHref;
            }
        });

        card.appendChild(header);
        card.appendChild(description);
        if (meta.textContent) {
            card.appendChild(meta);
        }
        if (tags.childElementCount > 0) {
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

    function createMetaChip(label, value) {
        if (typeof value !== 'string' || !value.trim()) {
            return null;
        }

        const chip = document.createElement('span');
        chip.textContent = `${label}: ${value.trim()}`;
        return chip;
    }

    function createList(items) {
        const list = document.createElement('ul');
        list.className = 'job-detail-list';

        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            list.appendChild(listItem);
        });

        return list;
    }

    function createSection(title, contentNode) {
        const section = document.createElement('section');
        section.className = 'job-detail-section';

        const heading = document.createElement('h3');
        heading.textContent = title;

        section.appendChild(heading);
        section.appendChild(contentNode);
        return section;
    }

    function createBackButton() {
        const backButton = document.createElement('a');
        backButton.className = 'btn btn-secondary';
        backButton.href = 'careers.html#open-roles';
        backButton.textContent = 'Back to open roles';
        return backButton;
    }

    function renderJobDetailError(container, message) {
        container.textContent = '';
        container.appendChild(createStatusMessage(message));

        const actions = document.createElement('div');
        actions.className = 'job-detail-actions';
        actions.appendChild(createBackButton());
        container.appendChild(actions);
    }

    function renderJobDetail(container, job, data) {
        container.textContent = '';

        const header = document.createElement('div');
        header.className = 'job-detail-header';

        const title = document.createElement('h2');
        title.textContent = typeof job.title === 'string' && job.title.trim() ? job.title.trim() : 'Job details';

        const type = document.createElement('span');
        type.className = 'role-type';
        type.textContent = typeof job.type === 'string' && job.type.trim() ? job.type.trim() : 'Role';

        header.appendChild(title);
        header.appendChild(type);
        container.appendChild(header);

        const meta = document.createElement('div');
        meta.className = 'job-detail-meta';

        const metaChips = [
            createMetaChip('Job ID', job.id),
            createMetaChip('Department', job.department),
            createMetaChip('Experience', job.experienceLevel),
            createMetaChip('Duration', job.duration),
            createMetaChip('Company', data.company)
        ].filter(Boolean);

        metaChips.forEach(chip => meta.appendChild(chip));
        if (meta.childElementCount > 0) {
            container.appendChild(meta);
        }

        const description = document.createElement('p');
        description.textContent = typeof job.description === 'string' && job.description.trim()
            ? job.description.trim()
            : 'No description available for this role yet.';
        container.appendChild(createSection('Role overview', description));

        const skills = cleanArray(job.requiredSkills);
        if (skills.length) {
            container.appendChild(createSection('Required skills', createList(skills)));
        }

        const workModes = cleanArray(job.mode);
        const globalLocations = cleanArray(data.location);
        const locationTags = workModes.length ? workModes : globalLocations;

        if (locationTags.length) {
            container.appendChild(createSection('Work mode', createTagContainer(locationTags)));
        }

        const actions = document.createElement('div');
        actions.className = 'job-detail-actions';

        const applyButton = document.createElement('a');
        applyButton.className = 'btn btn-primary';
        applyButton.href = `contact.html?job=${encodeURIComponent(title.textContent)}`;
        applyButton.textContent = 'Apply now';

        actions.appendChild(applyButton);
        actions.appendChild(createBackButton());
        container.appendChild(actions);

        const pageHeading = document.querySelector('[data-job-page-title]');
        if (pageHeading) {
            pageHeading.textContent = title.textContent;
        }

        const companyName = typeof data.company === 'string' && data.company.trim() ? data.company.trim() : 'Ainvnt';
        document.title = `${title.textContent} | Careers at ${companyName}`;
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
