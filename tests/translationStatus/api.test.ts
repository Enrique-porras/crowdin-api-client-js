import * as nock from 'nock';
import * as crowdin from '../../src/index';

describe('Translation Status API', () => {

    let scope: nock.Scope;
    const credentials: crowdin.Credentials = {
        login: 'testUser',
        accountKey: 'qwerty',
        organization: 'testOrg'
    };
    const api: crowdin.TranslationStatus.Api = new crowdin.TranslationStatus.Api(credentials);
    const projectId = 2;
    const branchId = 3;
    const directoryId = 4;
    const fileId = 5;
    const phrasesCount = 10;
    const issueId = 21;
    const languageId = 1111;

    const limit = 25;

    beforeAll(() => {
        scope = nock(api.url)
            .get(`/projects/${projectId}/issues`)
            .query({
                'account-key': api.accountKey,
                login: api.login
            })
            .reply(200, {
                data: [{
                    data: {
                        id: issueId
                    }
                }],
                pagination: {
                    offset: 0,
                    limit: limit
                }
            })
            .get(`/projects/${projectId}/branches/${branchId}/languages/progress`)
            .query({
                'account-key': api.accountKey,
                login: api.login
            })
            .reply(200, {
                data: [{
                    data: {
                        phrasesCount: phrasesCount
                    }
                }],
                pagination: {
                    offset: 0,
                    limit: limit
                }
            })
            .get(`/projects/${projectId}/directories/${directoryId}/languages/progress`)
            .query({
                'account-key': api.accountKey,
                login: api.login
            })
            .reply(200, {
                data: [{
                    data: {
                        phrasesCount: phrasesCount
                    }
                }],
                pagination: {
                    offset: 0,
                    limit: limit
                }
            })
            .get(`/projects/${projectId}/export-ready-progress`)
            .query({
                'account-key': api.accountKey,
                login: api.login
            })
            .reply(200, {
                data: [{
                    data: {
                        languageId: languageId
                    }
                }],
                pagination: {
                    offset: 0,
                    limit: limit
                }
            })
            .get(`/projects/${projectId}/files/${fileId}/languages/progress`)
            .query({
                'account-key': api.accountKey,
                login: api.login
            })
            .reply(200, {
                data: [{
                    data: {
                        phrasesCount: phrasesCount
                    }
                }],
                pagination: {
                    offset: 0,
                    limit: limit
                }
            })
            .get(`/projects/${projectId}/languages/progress`)
            .query({
                'account-key': api.accountKey,
                login: api.login
            })
            .reply(200, {
                data: [{
                    data: {
                        phrasesCount: phrasesCount
                    }
                }],
                pagination: {
                    offset: 0,
                    limit: limit
                }
            });
    });

    afterAll(() => {
        scope.done();
    });

    it('List reported issues', async () => {
        const issues = await api.listReportedIssues(projectId);
        expect(issues.data.length).toBe(1);
        expect(issues.data[0].data.id).toBe(issueId);
        expect(issues.pagination.limit).toBe(limit);
    });

    it('Get branch progress', async () => {
        const progress = await api.getBranchProgress(projectId, branchId);
        expect(progress.data.length).toBe(1);
        expect(progress.data[0].data.phrasesCount).toBe(phrasesCount);
        expect(progress.pagination.limit).toBe(limit);
    });

    it('Get directory progress', async () => {
        const progress = await api.getDirectoryProgress(projectId, directoryId);
        expect(progress.data.length).toBe(1);
        expect(progress.data[0].data.phrasesCount).toBe(phrasesCount);
        expect(progress.pagination.limit).toBe(limit);
    });

    it('Get project progress', async () => {
        const progress = await api.getProjectProgress(projectId);
        expect(progress.data.length).toBe(1);
        expect(progress.data[0].data.languageId).toBe(languageId);
        expect(progress.pagination.limit).toBe(limit);
    });

    it('Get file progress', async () => {
        const progress = await api.getFileProgress(projectId, fileId);
        expect(progress.data.length).toBe(1);
        expect(progress.data[0].data.phrasesCount).toBe(phrasesCount);
        expect(progress.pagination.limit).toBe(limit);
    });

    it('Get language progress', async () => {
        const progress = await api.getLanguageProgress(projectId);
        expect(progress.data.length).toBe(1);
        expect(progress.data[0].data.phrasesCount).toBe(phrasesCount);
        expect(progress.pagination.limit).toBe(limit);
    });
});