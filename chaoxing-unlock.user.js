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
                     * 强制文本可选中。
                     *
                     * 页面常用 user-select:none 让鼠标拖选失效。
                     * 实测学习通把这条样式挂在 <html> 的内联 style 上，
                     * 而不是正文容器的 class，所以必须
                     * 覆盖到 html/body 及其后代，并且带 !important。
                     */

                    const SELECT_STYLE_ID =
                        '__cx_paste_select_style__';

                    function injectSelectStyle() {

                        try {

                            if (
                                document.getElementById(
                                    SELECT_STYLE_ID
                                )
                            ) {
                                return true;
                            }

                            const style =
                                document.createElement('style');

                            style.id = SELECT_STYLE_ID;

                            style.textContent = `
html, body, body *:not(#__cx_paste_debug_panel__):not(#__cx_paste_debug_panel__ *) {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    -khtml-user-select: text !important;
    user-select: text !important;
    -webkit-touch-callout: default !important;
    -webkit-user-drag: auto !important;
}
::selection {
    background: #ffe58f !important;
    color: #111 !important;
}
`;

                            /*
                             * document-start 时 head 与 documentElement
                             * 都可能不存在，必须重试，
                             * 否则样式永远注入不进去。
                             */

                            const root =
                                document.head ||
                                document.documentElement;

                            if (!root) {

                                setTimeout(injectSelectStyle, 10);

                                return false;

                            }

                            root.appendChild(style);

                            return true;

                        } catch (err) {

                            setTimeout(injectSelectStyle, 50);

                            return false;

                        }
                    }


                    /*
                     * 还原被页面替换掉的选区 API。
                     *
                     * 页面可能把 getSelection 或 Selection.toString
                     * 换成返回空字符串，导致「能选中但复制为空」。
                     *
                     * 脚本运行在 document-idle，此时页面可能已经
                     * 完成替换，直接取当前值会拿到被替换后的版本。
                     * 因此这里做原生性校验，拿不到原生实现时
                     * 用一个同源空白 iframe 取干净的那份。
                     */

                    function looksNative(fn) {

                        try {

                            return (
                                typeof fn === 'function' &&
                                /\{\s*\[native code\]\s*\}/
                                    .test(
                                        Function.prototype
                                            .toString
                                            .call(fn)
                                    )
                            );

                        } catch (err) {

                            return false;

                        }
                    }


                    function getPristineSelectionApi() {

                        try {

                            const iframe =
                                document.createElement('iframe');

                            iframe.style.cssText =
                                'display:none;width:0;height:0;border:0';

                            (document.body ||
                                document.documentElement)
                                .appendChild(iframe);

                            const win = iframe.contentWindow;
                            const doc = win.document;

                            const api = {
                                getSelection: win.getSelection,
                                docGetSelection: doc.getSelection,
                                selectionToString:
                                    win.Selection.prototype.toString,
                                execCommand: doc.execCommand
                            };

                            iframe.remove();

                            return api;

                        } catch (err) {

                            return null;

                        }
                    }


                    const pristineApi =
                        getPristineSelectionApi() || {};

                    const native = {
                        getSelection:
                            looksNative(window.getSelection)
                                ? window.getSelection
                                : (
                                    pristineApi.getSelection ||
                                    window.getSelection
                                ),
                        docGetSelection:
                            looksNative(
                                window.Document.prototype
                                    .getSelection
                            )
                                ? window.Document.prototype
                                    .getSelection
                                : (
                                    pristineApi.docGetSelection ||
                                    window.Document.prototype
                                        .getSelection
                                ),
                        selectionToString:
                            looksNative(
                                window.Selection.prototype.toString
                            )
                                ? window.Selection.prototype.toString
                                : (
                                    pristineApi.selectionToString ||
                                    window.Selection.prototype
                                        .toString
                                ),
                        execCommand:
                            looksNative(
                                window.Document.prototype
                                    .execCommand
                            )
                                ? window.Document.prototype
                                    .execCommand
                                : (
                                    pristineApi.execCommand ||
                                    window.Document.prototype
                                        .execCommand
                                )
                    };


                    let restoredApiCount = 0;

                    function restoreSelectionApi() {

                        try {

                            if (
                                !looksNative(window.getSelection) &&
                                looksNative(native.getSelection)
                            ) {

                                Object.defineProperty(
                                    window,
                                    'getSelection',
                                    {
                                        configurable: true,
                                        writable: true,
                                        value: native.getSelection
                                    }
                                );

                                restoredApiCount++;
                            }

                        } catch (err) {}

                        try {

                            if (
                                !looksNative(
                                    window.Document.prototype
                                        .getSelection
                                ) &&
                                looksNative(native.docGetSelection)
                            ) {

                                Object.defineProperty(
                                    window.Document.prototype,
                                    'getSelection',
                                    {
                                        configurable: true,
                                        writable: true,
                                        value: native.docGetSelection
                                    }
                                );

                                restoredApiCount++;
                            }

                        } catch (err) {}

                        try {

                            if (
                                !looksNative(
                                    window.Selection.prototype
                                        .toString
                                ) &&
                                looksNative(
                                    native.selectionToString
                                )
                            ) {

                                Object.defineProperty(
                                    window.Selection.prototype,
                                    'toString',
                                    {
                                        configurable: true,
                                        writable: true,
                                        value:
                                            native.selectionToString
                                    }
                                );

                                restoredApiCount++;

                            }

                        } catch (err) {}

                        try {

                            if (
                                !looksNative(
                                    window.Document.prototype
                                        .execCommand
                                ) &&
                                looksNative(native.execCommand)
                            ) {

                                Object.defineProperty(
                                    window.Document.prototype,
                                    'execCommand',
                                    {
                                        configurable: true,
                                        writable: true,
                                        value: native.execCommand
                                    }
                                );

                                restoredApiCount++;

                            }

                        } catch (err) {}
                    }


                    /*
                     * 清理全屏透明遮罩。
                     *
                     * 只处理「覆盖大半视口 + 透明 + 无文本 +
                     * 无交互元素」的层，避免误伤正常弹窗。
                     */

                    let maskKilled = 0;

                    function killMasks() {

                        try {

                            const vw =
                                window.innerWidth || 1280;

                            const vh =
                                window.innerHeight || 800;

                            const total = vw * vh;

                            const nodes =
                                document.querySelectorAll(
                                    'div,section,aside,span,iframe,canvas'
                                );

                            for (
                                let i = 0;
                                i < nodes.length;
                                i++
                            ) {

                                const el = nodes[i];

                                if (
                                    el.id ===
                                        '__cx_paste_debug_panel__' ||
                                    el.hasAttribute('data-cx-mask')
                                ) {
                                    continue;
                                }

                                const cs =
                                    window.getComputedStyle(el);

                                if (!cs) {
                                    continue;
                                }

                                if (
                                    cs.position !== 'fixed' &&
                                    cs.position !== 'absolute'
                                ) {
                                    continue;
                                }

                                if (
                                    cs.display === 'none' ||
                                    cs.visibility === 'hidden'
                                ) {
                                    continue;
                                }

                                const zi = parseInt(cs.zIndex, 10);

                                if (!isNaN(zi) && zi < 1) {
                                    continue;
                                }

                                const r = el.getBoundingClientRect();

                                if (
                                    r.width * r.height <
                                    total * 0.4
                                ) {
                                    continue;
                                }

                                if (
                                    (el.textContent || '')
                                        .trim().length > 12
                                ) {
                                    continue;
                                }

                                if (
                                    el.querySelector(
                                        'img,video,object,embed,' +
                                        'input,textarea,button,a'
                                    )
                                ) {
                                    continue;
                                }

                                const bg = cs.backgroundColor;

                                const transparent =
                                    bg === 'transparent' ||
                                    /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0\s*\)/
                                        .test(bg);

                                if (!transparent) {
                                    continue;
                                }

                                el.setAttribute('data-cx-mask', '1');

                                el.style.setProperty(
                                    'pointer-events',
                                    'none',
                                    'important'
                                );

                                maskKilled++;

                            }

                        } catch (err) {}
                    }


                    /*
                     * 读写剪贴板与文本插入的底层工具。
                     */

                    function selectionText() {

                        try {

                            const sel =
                                native.docGetSelection
                                    ? native.docGetSelection
                                        .call(document)
                                    : window.getSelection();

                            if (!sel || !sel.rangeCount) {
                                return '';
                            }

                            try {

                                return native
                                    .selectionToString
                                    .call(sel);

                            } catch (err) {

                                return String(sel);

                            }

                        } catch (err) {

                            return '';

                        }
                    }


                    function legacyCopy(text) {

                        try {

                            const ta =
                                document.createElement(
                                    'textarea'
                                );

                            ta.value = text;

                            ta.setAttribute('data-cx-temp', '1');

                            ta.style.cssText =
                                'position:fixed;top:0;left:0;' +
                                'width:1px;height:1px;opacity:0;' +
                                'border:0;padding:0;z-index:-1';

                            (document.body ||
                                document.documentElement)
                                .appendChild(ta);

                            ta.select();

                            ta.setSelectionRange(0, text.length);

                            try {

                                native.execCommand
                                    .call(document, 'copy');

                            } catch (err) {}

                            ta.remove();

                        } catch (err) {}
                    }


                    function writeClipboard(text) {

                        if (!text) {
                            return;
                        }

                        try {

                            if (
                                navigator.clipboard &&
                                navigator.clipboard.writeText
                            ) {

                                navigator.clipboard
                                    .writeText(text)
                                    .catch(() => legacyCopy(text));

                                return;

                            }

                        } catch (err) {}

                        legacyCopy(text);
                    }


                    function insertText(el, text) {

                        try {

                            if (el.isContentEditable) {

                                el.focus();

                                const sel =
                                    native.docGetSelection
                                        .call(document);

                                if (sel && sel.rangeCount) {

                                    const range =
                                        sel.getRangeAt(0);

                                    range.deleteContents();

                                    const node =
                                        document.createTextNode(
                                            text
                                        );

                                    range.insertNode(node);

                                    range.setStartAfter(node);

                                    range.collapse(true);

                                    sel.removeAllRanges();

                                    sel.addRange(range);

                                } else {

                                    el.textContent += text;

                                }

                                el.dispatchEvent(
                                    new Event('input', {
                                        bubbles: true
                                    })
                                );

                                return;

                            }

                            const start =
                                el.selectionStart == null
                                    ? el.value.length
                                    : el.selectionStart;

                            const end =
                                el.selectionEnd == null
                                    ? el.value.length
                                    : el.selectionEnd;

                            el.value =
                                el.value.slice(0, start) +
                                text +
                                el.value.slice(end);

                            el.selectionStart =
                                el.selectionEnd =
                                    start + text.length;

                            el.dispatchEvent(
                                new Event('input', {
                                    bubbles: true
                                })
                            );

                        } catch (err) {}
                    }


                    function isTextField(el) {

                        if (!el) {
                            return false;
                        }

                        return (
                            el.tagName === 'TEXTAREA' ||
                            (
                                el.tagName === 'INPUT' &&
                                !/^(checkbox|radio|file|button|submit)$/i
                                    .test(el.type || '')
                            ) ||
                            !!el.isContentEditable
                        );
                    }


                    /*
                     * 接管 Ctrl+C / Ctrl+V / Ctrl+X。
                     *
                     * 页面常用 document.onkeydown = () => false
                     * 来取消快捷键默认行为。这种取消发生在内核层，
                     * 覆盖事件对象的 preventDefault 拦不住
                     * （实测无效），只能抢先把按键截断后自己实现。
                     *
                     * 必须注册在 window 捕获阶段，
                     * 才能早于页面的 document 捕获监听器。
                     */

                    function handleShortcut(e) {

                        if (
                            !(e.ctrlKey || e.metaKey) ||
                            e.altKey
                        ) {
                            return;
                        }

                        const key =
                            String(e.key).toLowerCase();

                        if (
                            key !== 'c' &&
                            key !== 'v' &&
                            key !== 'x'
                        ) {
                            return;
                        }

                        const target = e.target;

                        if (key === 'v') {

                            if (!isTextField(target)) {
                                return;
                            }

                            e.preventDefault();

                            try {
                                e.stopImmediatePropagation();
                            } catch (err) {}

                            try {
                                e.stopPropagation();
                            } catch (err) {}

                            try {

                                if (
                                    navigator.clipboard &&
                                    navigator.clipboard.readText
                                ) {

                                    navigator.clipboard
                                        .readText()
                                        .then(
                                            text => {

                                                if (text) {
                                                    insertText(
                                                        target,
                                                        text
                                                    );
                                                }

                                            }
                                        )
                                        .catch(() => {});

                                }

                            } catch (err) {}

                            return;

                        }

                        e.preventDefault();

                        try {
                            e.stopImmediatePropagation();
                        } catch (err) {}

                        try {
                            e.stopPropagation();
                        } catch (err) {}

                        const text = selectionText();

                        if (!text || !text.trim()) {
                            return;
                        }

                        writeClipboard(text);

                        if (key === 'x' && !isTextField(target)) {

                            try {

                                const sel =
                                    native.docGetSelection
                                        .call(document);

                                if (sel && sel.rangeCount) {

                                    for (
                                        let i = 0;
                                        i < sel.rangeCount;
                                        i++
                                    ) {

                                        sel.getRangeAt(i)
                                            .deleteContents();

                                    }

                                }

                            } catch (err) {}

                        }
                    }


                    /*
                     * 可打印字符兜底。
                     *
                     * 页面用 onkeydown 返回 false 时字符根本不会
                     * 进入输入框。这里先让浏览器正常处理，
                     * 一个 tick 后检查值没变就手动补写。
                     * 不做无差别拦截，避免影响输入法组合。
                     */

                    function handlePrintableKey(e) {

                        if (
                            e.ctrlKey ||
                            e.metaKey ||
                            e.altKey ||
                            e.isComposing
                        ) {
                            return;
                        }

                        if (
                            e.key.length !== 1 ||
                            e.key === 'Enter'
                        ) {
                            return;
                        }

                        const target = e.target;

                        if (
                            !target ||
                            target.isContentEditable ||
                            !isTextField(target)
                        ) {
                            return;
                        }

                        const key = e.key;

                        const before = target.value;

                        setTimeout(
                            () => {

                                try {

                                    if (target.value !== before) {
                                        return;
                                    }

                                    insertText(target, key);

                                } catch (err) {}

                            },
                            0
                        );
                    }


                    window.addEventListener(
                        'keydown',
                        handleShortcut,
                        true
                    );

                    window.addEventListener(
                        'keydown',
                        handlePrintableKey,
                        true
                    );


                    injectSelectStyle();
                    restoreSelectionApi();
                    killMasks();


                    /*
                     * 持续复查：页面可能在初始化完成后再覆盖
                     * 选区 API 或重写 html 的 user-select。
                     */

                    setInterval(
                        () => {

                            restoreSelectionApi();

                            injectSelectStyle();

                        },
                        500
                    );



                    /*
                     * 对外暴露诊断数据
                     */

                    window.__CX_PASTE_DEBUG__ = {

                        version: '4.1.0',

                        events: EVENTS,

                        guardedEvents: GUARDED_EVENTS,

                        passiveEvents: PASSIVE_EVENTS,

                        counter: counter,

                        restoredApiCount: () => restoredApiCount,

                        maskKilled: () => maskKilled,

                        sweep: () => {

                            injectSelectStyle();

                            restoreSelectionApi();

                            killMasks();

                        },

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

                /*
                 * 早期注入时 documentElement 可能还没生成。
                 * 直接放弃会让脚本永远不生效，这里延迟重试。
                 */

                error(
                    '无法找到 script 注入位置，100ms 后重试'
                );

                setTimeout(
                    () => injectIntoMainWorld(targetDocument),
                    100
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