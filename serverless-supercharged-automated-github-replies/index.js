const sdk = require('kinvey-flex-sdk');
const { Octokit } = require('@octokit/rest');

sdk.service((err, flex) => {
    if (err) throw err;
    flex.functions.register('postComment', (context, complete, modules) => {
        const endOk = () => complete().setBody({}).ok().next();
        const endErr = () => complete().setBody({}).runtimeError().done();
        if (context.body.action === 'opened') {
            return new Octokit({ auth: process.env.GH_ACC_TKN}).issues.createComment({
                repo: context.body.repository.name,
                owner: context.body.repository.owner.login,
                issue_number: context.body.issue.number,
                body: `You rock ${context.body.issue.user.login}!!!`
            }).then(
                (data) => {
                    console.log(data);
                    return endOk();
                }
            )
            .catch(
                (err) => {
                    console.error(err);
                    return endErr();
                }
            );
        }
        return endOk();
    });
});
