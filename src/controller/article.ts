import {
    $AddArticle,
    $DelArticle,
    $GetDetails,
    $PageView,
    $DelLikes,
    $ModifyArticle,
    $ArticleList,
    $AddLikes
} from "../service/article";
import { $GetComment } from "../service/comment";
// 添加文章
export const addAtricle = async (ctx: any) => {
    let { title, content, brief, category_id, author_id } = ctx.request.body;
    [title, content, brief, category_id, author_id].forEach(v => {
        if (!v) throw 1;
    });
    // 转码
    content = encodeURI(content);
    // insert article to db
    await $AddArticle({ title, content, brief, category_id, author_id });
    // send
    ctx.body = {
        msg: "ok",
        err: 0
    };
};
//
// 删除文章
export const delArticle = async (ctx: any) => {
    const { id } = ctx.request.body;
    if (!id) throw 1;
    // delete to db
    await $DelArticle(id);
    // send
    ctx.body = {
        msg: "ok",
        err: 0
    };
};
// 获取文章详情
export const articleDetails = async (ctx: any) => {
    const { id, user_id = "" } = ctx.query;
    if (!id) throw 1;
    // get article details
    const [res, comment] = await Promise.all([
        $GetDetails(id, user_id),
        $GetComment(id)
    ]);
    // const res = await $GetDetails(id, user_id);
    // const comment = await $GetComment(id);
    const _res = res.data[0];
    // 解码
    _res.content = decodeURI(_res.content);
    // update pv
    $PageView(id, _res.pv);
    // send
    ctx.body = {
        msg: "ok",
        err: 0,
        data: {
            detail: _res,
            comment: comment.data
        }
    };
};

// modify article detaile
export const modifyArticle = async (ctx: any) => {
    const param = ctx.request.body;
    // verification params
    "id,title,content,brief,category_id".split(",").forEach(v => {
        if (!param[v]) throw 1;
    });
    // 转码
    param.content = encodeURI(param.content);
    // modify db
    await $ModifyArticle(param);
    // send
    ctx.body = {
        msg: "ok",
        err: 0
    };
};

// get article list
export const getArticleList = async (ctx: any) => {
    const { categoty_id = 0, page = 1, total = 10 } = ctx.query;
    // get article list to db
    const [l, t] = await $ArticleList(categoty_id, page, total);
    // send
    ctx.body = {
        msg: "ok",
        err: 0,
        total: t.data[0].count,
        data: l.data
    };
};

// cancel likes
export const delLikes = async (ctx: any) => {
    const { user_id, article_id } = ctx.request.body;
    if (!user_id || !article_id) throw 1;
    // delete likes to db
    await $DelLikes(user_id, article_id);
    // send
    ctx.body = {
        msg: "ok",
        err: 0
    };
};

// add likes
export const addLikes = async (ctx: any) => {
    const { article_id, category_id, user_id } = ctx.request.body;
    if (!article_id || !category_id || !user_id) throw 1;
    // insert likes to db
    await $AddLikes(article_id, user_id, category_id);
    // send
    ctx.body = {
        msg: "ok",
        err: 0
    };
};
