// ==UserScript==
// @name         学习通复制粘贴解除 - MAIN环境诊断版
// @namespace    chaoxing-mainworld-debug
// @version      4.1.0
// @license      MIT
// @description  针对学习通 mooc2-ans 作答页面，模拟 Console 环境解除复制粘贴限制
// @author       SeiShonagon520
// @homepageURL  https://github.com/SeiShonagon520/chaoxing-copypaste-unlocker
// @supportURL   https://github.com/SeiShonagon520/chaoxing-copypaste-unlocker/issues
// @match        https://mooc2-ans.chaoxing.com/*
// @match        https://*.chaoxing.com/*
// @run-at       document-idle
// @inject-into  content
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/593720/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E8%A7%A3%E9%99%A4%20-%20MAIN%E7%8E%AF%E5%A2%83%E8%AF%8A%E6%96%AD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/593720/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E8%A7%A3%E9%99%A4%20-%20MAIN%E7%8E%AF%E5%A2%83%E8%AF%8A%E6%96%AD%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /************************************************************
     * 基础配置
     ************************************************************/

    const PREFIX = '[粘贴助手]';

    const EVENTS = [
        'paste',
        'copy',
        'cut',
        'contextmenu',
        'keydown',
        'keyup',
        'keypress',
        'selectstart',
        'dragstart',
        'mousedown'
    ];

    let logNumber = 0;
    let injectionCount = 0;
    let scanCount = 0;


    /************************************************************
     * 日志系统
     ************************************************************/

    function log(...args) {
        logNumber++;

        console.log(
            `${PREFIX} [${logNumber}]`,
            ...args
        );
    }

    function info(...args) {
        logNumber++;

        console.info(
            `%c${PREFIX} [${logNumber}]`,
            'color:#2196f3;font-weight:bold;',
            ...args
        );
    }

    function success(...args) {
        logNumber++;

        console.log(
            `%c${PREFIX} [${logNumber}]`,
            'color:#00a000;font-weight:bold;',
            ...args
        );
    }

    function warn(...args) {
        logNumber++;

        console.warn(
            `%c${PREFIX} [${logNumber}]`,
            'color:#ff9800;font-weight:bold;',
            ...args
        );
    }

    function error(...args) {
        logNumber++;

        console.error(
            `%c${PREFIX} [${logNumber}]`,
            'color:#f44336;font-weight:bold;',
            ...args
        );
    }


    /************************************************************
     * 启动
     ************************************************************/

    console.log(
        '%c================================================',
        'color:#9c27b0;font-weight:bold;'
    );

    console.log(
        '%c[粘贴助手] 4.0 MAIN 环境诊断版启动',
        'color:#9c27b0;font-size:18px;font-weight:bold;'
    );

    console.log(
        '%c================================================',
        'color:#9c27b0;font-weight:bold;'
    );


    /************************************************************
     * 页面基本信息
     ************************************************************/

    info('开始读取当前页面信息');

    log('location.href =', location.href);

    log('location.origin =', location.origin);

    log('location.host =', location.host);

    log('location.pathname =', location.pathname);

    log('document.readyState =', document.readyState);

    log('document.URL =', document.URL);

    log('window === window.top =', window === window.top);

    log(
        'iframe 数量 =',
        document.querySelectorAll('iframe').length
    );

    log(
        'input 数量 =',
        document.querySelectorAll('input').length
    );

    log(
        'textarea 数量 =',
        document.querySelectorAll('textarea').length
    );

    log(
        'contenteditable 数量 =',
        document.querySelectorAll(
            '[contenteditable="true"], [contenteditable=""]'
        ).length
    );


    /************************************************************
     * 页面右上角状态面板
     ************************************************************/

    function createStatusPanel() {

        try {

            let panel =
                document.getElementById(
                    '__cx_paste_debug_panel__'
                );

            if (panel) {
                return panel;
            }


            panel =
                document.createElement('div');

            panel.id =
                '__cx_paste_debug_panel__';


            panel.style.cssText = `
                position: fixed;
                right: 12px;
                top: 12px;
                z-index: 2147483647;
                background: rgba(0,0,0,0.85);
                color: #fff;
                padding: 10px 14px;
                border-radius: 8px;
                font-family: Consolas, monospace;
                font-size: 12px;
                line-height: 1.6;
                box-shadow: 0 3px 15px rgba(0,0,0,0.35);
                max-width: 420px;
                pointer-events: none;
            `;


            panel.innerHTML = `
                <div style="font-weight:bold;color:#ff9800">
                    学习通粘贴助手 4.0
                </div>
                <div id="__cx_status_main__">
                    MAIN 环境：检测中
                </div>
                <div id="__cx_status_inject__">
                    注入次数：0
                </div>
                <div id="__cx_status_event__">
                    paste：0
                </div>
            `;


            if (document.body) {

                document.body.appendChild(panel);

            } else {

                document.documentElement.appendChild(panel);

            }


            return panel;

        } catch (e) {

            error(
                '创建状态面板失败:',
                e
            );

            return null;
        }
    }


    function updatePanel(
        mainStatus,
        eventCount = 0
    ) {

        try {

            const panel =
                document.getElementById(
                    '__cx_paste_debug_panel__'
                );

            if (!panel) {
                return;
            }


            const main =
                document.getElementById(
                    '__cx_status_main__'
                );

            const inject =
                document.getElementById(
                    '__cx_status_inject__'
                );

            const event =
                document.getElementById(
                    '__cx_status_event__'
                );


            if (main) {

                main.textContent =
                    `MAIN 环境：${mainStatus}`;

            }

            if (inject) {

                inject.textContent =
                    `注入次数：${injectionCount}`;

            }

            if (event) {

                event.textContent =
                    `paste：${eventCount}`;

            }

        } catch (_) {}
    }


    createStatusPanel();


    /************************************************************
     * 这是最关键的部分：
     *
     * 把代码真正注入网页 MAIN world
     ************************************************************/

    function injectIntoMainWorld(targetDocument) {

        injectionCount++;

        info(
            `第 ${injectionCount} 次尝试注入 MAIN world`,
            targetDocument?.URL
        );


        if (!targetDocument) {

            error(
                '目标 document 不存在'
            );

            return false;
        }


        try {

            /*
             * 如果这个页面已经成功注入过，
             * 就不重复注册。
             */

            if (
                targetDocument.documentElement &&
                targetDocument.documentElement
                    .getAttribute(
                        'data-cx-paste-main'
                    ) === '1'
            ) {

                success(
                    '检测到 MAIN world 已经成功注入'
                );

                updatePanel(
                    '✅ 已注入',
                    0
                );

                return true;
            }


            /********************************************************
             * 真正运行在网页 MAIN world 里的函数
             ********************************************************/

            const mainWorldFunction =
                function () {

                    'use strict';


                    const FLAG =
                        'data-cx-paste-main';


                    /*
                     * 防止重复注入
                     */

                    if (
                        document.documentElement &&
                        document.documentElement
                            .getAttribute(FLAG) === '1'
                    ) {

                        console.log(
                            '[粘贴助手][PAGE] 已经注入过，跳过'
                        );

                        return;
                    }


                    /*
                     * 设置 MAIN world 已注入标记
                     */

                    if (document.documentElement) {

                        document.documentElement
                            .setAttribute(
                                FLAG,
                                '1'
                            );
                    }


                    console.log(
                        '%c[粘贴助手][PAGE] MAIN world 注入成功',
                        'color:#00aa00;font-weight:bold;'
                    );


                    console.log(
                        '[粘贴助手][PAGE] URL:',
                        location.href
                    );


                    console.log(
                        '[粘贴助手][PAGE] window === top:',
                        window === window.top
                    );


                    /*
                     * 事件列表
                     *
                     * 分两类处理：
                     *
                     * GUARDED（守卫）：
                     *   页面拦截这些事件没有正当理由，
                     *   可以直接截断传播。
                     *
                     * PASSIVE（放行）：
                     *   这些事件和页面交互强相关（输入、点击、按键）。
                     *   早期版本对所有事件统一 stopPropagation，
                     *   会让编辑器/输入框自身的处理器收不到事件，
                     *   表现为「输入框不能输入、粘贴无反应」。
                     *   这里只让 preventDefault / returnValue 失效，
                     *   事件照常冒泡。
                     */

                    const GUARDED_EVENTS = [
                        'copy',
                        'cut',
                        'contextmenu',
                        'selectstart',
                        'dragstart'
                    ];

                    const PASSIVE_EVENTS = [
                        'paste',
                        'beforepaste',
                        'keydown',
                        'keyup',
                        'keypress',
                        'mousedown',
                        'mouseup'
                    ];

                    const EVENTS = GUARDED_EVENTS.concat(
                        PASSIVE_EVENTS
                    );


                    /*
                     * 事件统计
                     */

                    const counter = {};


                    EVENTS.forEach(
                        type => {

                            counter[type] = 0;

                        }
                    );


                    /*
                     * 让事件对象上的取消动作失效。
                     *
                     * 页面常用 preventDefault() 或 returnValue = false
                     * 取消复制/粘贴的默认行为。
                     * 只改事件实例，不动原型，避免影响页面其他逻辑。
                     */

                    function neutralizeEvent(e) {

                        try {

                            if (e.__cxNeutralized) {
                                return;
                            }

                            Object.defineProperty(
                                e,
                                '__cxNeutralized',
                                {
                                    configurable: true,
                                    value: true
                                }
                            );

                            Object.defineProperty(
                                e,
                                'preventDefault',
                                {
                                    configurable: true,
                                    value: function () {}
                                }
                            );

                            Object.defineProperty(
                                e,
                                'returnValue',
                                {
                                    configurable: true,
                                    get: () => true,
                                    set: () => {}
                                }
                            );

                            Object.defineProperty(
                                e,
                                'defaultPrevented',
                                {
                                    configurable: true,
                                    get: () => false
                                }
                            );

                        } catch (err) {}

                    }


                    /*
                     * 注册事件
                     *
                     * 必须同时注册在 window 和 document 上，都走捕获阶段。
                     *
                     * window 捕获早于 document 捕获：
                     * 页面常在 document 捕获阶段拦截，
                     * 只注册 document 会被它抢先，
                     * 我们的守卫来不及执行。
                     */

                    const eventTargets = [window, document];

                    GUARDED_EVENTS.forEach(
                        type => {

                            eventTargets.forEach(
                                target => {

                                    target.addEventListener(
                                        type,
                                        function (e) {

                                            counter[type]++;

                                            neutralizeEvent(e);

                                            /*
                                             * 这一类事件页面拦截没有正当性，
                                             * 直接截断，页面处理器收不到。
                                             * 浏览器默认的复制/右键菜单不受影响。
                                             */

                                            try {
                                                e.stopImmediatePropagation();
                                            } catch (err) {}

                                            try {
                                                e.stopPropagation();
                                            } catch (err) {}

                                        },
                                        true
                                    );

                                }
                            );

                        }
                    );


                    PASSIVE_EVENTS.forEach(
                        type => {

                            eventTargets.forEach(
                                target => {

                                    target.addEventListener(
                                        type,
                                        function (e) {

                                            counter[type]++;

                                            /*
                                             * 只解除取消动作，不阻断传播，
                                             * 页面自身的输入处理、
                                             * 编辑器逻辑、快捷键响应仍然正常。
                                             */

                                            neutralizeEvent(e);

                                        },
                                        true
                                    );

                                }
                            );

                        }
                    );


                    console.log(
                        '[粘贴助手][PAGE] 已注册守卫事件:',
                        GUARDED_EVENTS.join(',')
                    );

                    console.log(
                        '[粘贴助手][PAGE] 已注册放行事件:',
                        PASSIVE_EVENTS.join(',')
                    );


                    /*
                     * 对外暴露诊断数据
                     */

                    window.__CX_PASTE_DEBUG__ = {

                        version: '4.0.0',

                        events: EVENTS,

                        counter: counter,

                        status: function () {

                            return {

                                url:
                                    location.href,

                                readyState:
                                    document.readyState,

                                iframeCount:
                                    document.querySelectorAll(
                                        'iframe'
                                    ).length,

                                textareaCount:
                                    document.querySelectorAll(
                                        'textarea'
                                    ).length,

                                inputCount:
                                    document.querySelectorAll(
                                        'input'
                                    ).length,

                                contenteditableCount:
                                    document.querySelectorAll(
                                        '[contenteditable="true"], [contenteditable=""]'
                                    ).length,

                                counter: {
                                    ...counter
                                }

                            };

                        }

                    };


                    console.log(
                        '%c[粘贴助手][PAGE] 所有监听器注册完成',
                        'color:#00aa00;font-weight:bold;'
                    );


                    console.log(
                        '[粘贴助手][PAGE] 诊断对象:',
                        'window.__CX_PASTE_DEBUG__'
                    );

                };


            /********************************************************
             * 转成 <script> 在 MAIN world 执行
             ********************************************************/

            const script =
                targetDocument.createElement(
                    'script'
                );


            script.textContent =
                '(' +
                mainWorldFunction.toString() +
                ')();';


            const root =
                targetDocument.documentElement ||
                targetDocument.head ||
                targetDocument.body;


            if (!root) {

                error(
                    '无法找到 script 注入位置'
                );

                return false;
            }


            /*
             * 插入
             */

            root.appendChild(script);


            /*
             * script 执行后删除节点
             */

            script.remove();


            /*
             * 检查 DOM 标记
             */

            const successFlag =
                targetDocument.documentElement
                    ?.getAttribute(
                        'data-cx-paste-main'
                    );


            if (
                successFlag === '1'
            ) {

                success(
                    '✅ MAIN world 注入成功'
                );

                updatePanel(
                    '✅ 已注入',
                    0
                );

                return true;

            } else {

                warn(
                    '⚠️ script 已插入，但没有检测到 MAIN world 标记'
                );

                updatePanel(
                    '⚠️ 未确认',
                    0
                );

                return false;
            }


        } catch (e) {

            error(
                'MAIN world 注入失败:',
                e,
                e?.stack
            );

            updatePanel(
                '❌ 注入失败',
                0
            );

            return false;
        }
    }


    /************************************************************
     * 处理 iframe
     ************************************************************/

    function scanIframes() {

        scanCount++;

        info(
            `开始扫描 iframe，第 ${scanCount} 次`
        );


        const frames =
            document.querySelectorAll(
                'iframe'
            );


        log(
            '当前 iframe 数量:',
            frames.length
        );


        frames.forEach(
            (frame, index) => {

                try {

                    const src =
                        frame.src || '(无 src)';


                    log(
                        `iframe[${index}]`,
                        {
                            src,
                            id: frame.id,
                            name: frame.name
                        }
                    );


                    const frameDocument =
                        frame.contentDocument;


                    if (
                        !frameDocument
                    ) {

                        warn(
                            `iframe[${index}] 无法访问 contentDocument`
                        );

                        return;
                    }


                    success(
                        `iframe[${index}] 可以访问`,
                        frameDocument.URL
                    );


                    injectIntoMainWorld(
                        frameDocument
                    );


                    frame.addEventListener(
                        'load',
                        () => {

                            info(
                                `iframe[${index}] load`
                            );


                            setTimeout(
                                () => {

                                    injectIntoMainWorld(
                                        frame.contentDocument
                                    );

                                },
                                100
                            );

                        }
                    );


                } catch (e) {

                    warn(
                        `iframe[${index}] 处理失败:`,
                        e
                    );

                }

            }
        );
    }


    /************************************************************
     * 当前页面注入
     ************************************************************/

    info(
        '开始第一次 MAIN world 注入'
    );

    injectIntoMainWorld(
        document
    );


    /************************************************************
     * iframe 扫描
     ************************************************************/

    scanIframes();


    /************************************************************
     * MutationObserver
     ************************************************************/

    try {

        const observer =
            new MutationObserver(
                mutations => {

                    let newIframes = 0;


                    for (
                        const mutation
                        of mutations
                    ) {

                        for (
                            const node
                            of mutation.addedNodes
                        ) {

                            if (
                                node.nodeType !== 1
                            ) {
                                continue;
                            }


                            /*
                             * 新增 iframe
                             */

                            if (
                                node.tagName ===
                                'IFRAME'
                            ) {

                                newIframes++;

                                info(
                                    'MutationObserver 发现新 iframe'
                                );


                                setTimeout(
                                    () => {

                                        try {

                                            injectIntoMainWorld(
                                                node.contentDocument
                                            );

                                        } catch (e) {

                                            warn(
                                                '动态 iframe 注入失败:',
                                                e
                                            );

                                        }

                                    },
                                    100
                                );

                            }


                            /*
                             * 新增节点内部的 iframe
                             */

                            if (
                                node.querySelectorAll
                            ) {

                                node.querySelectorAll(
                                    'iframe'
                                ).forEach(
                                    frame => {

                                        newIframes++;

                                        setTimeout(
                                            () => {

                                                try {

                                                    injectIntoMainWorld(
                                                        frame.contentDocument
                                                    );

                                                } catch (e) {

                                                    warn(
                                                        '子 iframe 注入失败:',
                                                        e
                                                    );

                                                }

                                            },
                                            100
                                        );

                                    }
                                );

                            }

                        }

                    }


                    if (newIframes) {

                        info(
                            '本次 DOM 变化发现新 iframe:',
                            newIframes
                        );

                    }

                }
            );


        observer.observe(
            document.documentElement,
            {
                childList: true,
                subtree: true
            }
        );


        success(
            'MutationObserver 安装成功'
        );

    } catch (e) {

        error(
            'MutationObserver 安装失败:',
            e,
            e?.stack
        );

    }


    /************************************************************
     * 定时重新扫描
     *
     * Vue 页面可能晚一点才生成真正的作答区域。
     ************************************************************/

    let periodicCount = 0;


    const periodicTimer =
        setInterval(
            () => {

                periodicCount++;


                if (
                    periodicCount > 15
                ) {

                    clearInterval(
                        periodicTimer
                    );


                    success(
                        '定时扫描结束'
                    );

                    return;
                }


                info(
                    `定时检查第 ${periodicCount} 次`
                );


                /*
                 * 重新尝试 MAIN world
                 */

                injectIntoMainWorld(
                    document
                );


                /*
                 * 重新扫描 iframe
                 */

                scanIframes();


            },
            1500
        );


    /************************************************************
     * 监听 SPA 路由变化
     ************************************************************/

    try {

        const originalPushState =
            history.pushState;

        history.pushState =
            function (...args) {

                const result =
                    originalPushState.apply(
                        this,
                        args
                    );


                setTimeout(
                    () => {

                        info(
                            '检测到 history.pushState'
                        );

                        info(
                            '新的 URL:',
                            location.href
                        );


                        injectIntoMainWorld(
                            document
                        );


                        scanIframes();

                    },
                    100
                );


                return result;
            };


        const originalReplaceState =
            history.replaceState;

        history.replaceState =
            function (...args) {

                const result =
                    originalReplaceState.apply(
                        this,
                        args
                    );


                setTimeout(
                    () => {

                        info(
                            '检测到 history.replaceState'
                        );

                        info(
                            '新的 URL:',
                            location.href
                        );


                        injectIntoMainWorld(
                            document
                        );


                        scanIframes();

                    },
                    100
                );


                return result;
            };


        window.addEventListener(
            'popstate',
            () => {

                info(
                    '检测到 popstate'
                );

                injectIntoMainWorld(
                    document
                );

                scanIframes();

            }
        );


        success(
            'SPA 路由监听安装成功'
        );

    } catch (e) {

        error(
            'SPA 路由监听安装失败:',
            e
        );

    }


    /************************************************************
     * 最终启动信息
     ************************************************************/

    success(
        '================================================'
    );

    success(
        '初始化流程已经执行完毕'
    );

    success(
        '当前页面:',
        location.href
    );

    success(
        '请现在测试 Ctrl+C → Ctrl+V'
    );

    success(
        '================================================'
    );

})();