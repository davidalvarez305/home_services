/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./constants.ts":
/*!**********************!*\
  !*** ./constants.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"BUCKET_URL\": () => (/* binding */ BUCKET_URL),\n/* harmony export */   \"CLIENT_DOMAIN\": () => (/* binding */ CLIENT_DOMAIN),\n/* harmony export */   \"LOGIN_ROUTE\": () => (/* binding */ LOGIN_ROUTE),\n/* harmony export */   \"LOGOUT_ROUTE\": () => (/* binding */ LOGOUT_ROUTE),\n/* harmony export */   \"USER_ROUTE\": () => (/* binding */ USER_ROUTE)\n/* harmony export */ });\nconst LOGIN_ROUTE = process.env.REACT_APP_API_URL + \"api/user/login\";\nconst LOGOUT_ROUTE = process.env.REACT_APP_API_URL + \"api/user/logout\";\nconst USER_ROUTE = process.env.REACT_APP_API_URL + \"api/user\";\nconst CLIENT_DOMAIN = process.env.REACT_APP_CLIENT_DOMAIN;\nconst BUCKET_URL = process.env.REACT_APP_BUCKET_URL;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb25zdGFudHMudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBTyxNQUFNQSxjQUFjQyxRQUFRQyxHQUFHLENBQUNDLGlCQUFpQixHQUFHLGlCQUFpQjtBQUNyRSxNQUFNQyxlQUFlSCxRQUFRQyxHQUFHLENBQUNDLGlCQUFpQixHQUFHLGtCQUFrQjtBQUN2RSxNQUFNRSxhQUFhSixRQUFRQyxHQUFHLENBQUNDLGlCQUFpQixHQUFHLFdBQVc7QUFDOUQsTUFBTUcsZ0JBQWdCTCxRQUFRQyxHQUFHLENBQUNLLHVCQUF1QixDQUFDO0FBQzFELE1BQU1DLGFBQWFQLFFBQVFDLEdBQUcsQ0FBQ08sb0JBQW9CLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jcm0vLi9jb25zdGFudHMudHM/ZGQ0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgTE9HSU5fUk9VVEUgPSBwcm9jZXNzLmVudi5SRUFDVF9BUFBfQVBJX1VSTCArIFwiYXBpL3VzZXIvbG9naW5cIjtcbmV4cG9ydCBjb25zdCBMT0dPVVRfUk9VVEUgPSBwcm9jZXNzLmVudi5SRUFDVF9BUFBfQVBJX1VSTCArIFwiYXBpL3VzZXIvbG9nb3V0XCI7XG5leHBvcnQgY29uc3QgVVNFUl9ST1VURSA9IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9BUElfVVJMICsgXCJhcGkvdXNlclwiO1xuZXhwb3J0IGNvbnN0IENMSUVOVF9ET01BSU4gPSBwcm9jZXNzLmVudi5SRUFDVF9BUFBfQ0xJRU5UX0RPTUFJTjtcbmV4cG9ydCBjb25zdCBCVUNLRVRfVVJMID0gcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0JVQ0tFVF9VUkw7Il0sIm5hbWVzIjpbIkxPR0lOX1JPVVRFIiwicHJvY2VzcyIsImVudiIsIlJFQUNUX0FQUF9BUElfVVJMIiwiTE9HT1VUX1JPVVRFIiwiVVNFUl9ST1VURSIsIkNMSUVOVF9ET01BSU4iLCJSRUFDVF9BUFBfQ0xJRU5UX0RPTUFJTiIsIkJVQ0tFVF9VUkwiLCJSRUFDVF9BUFBfQlVDS0VUX1VSTCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./constants.ts\n");

/***/ }),

/***/ "./context/UserContext.tsx":
/*!*********************************!*\
  !*** ./context/UserContext.tsx ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"UserContext\": () => (/* binding */ UserContext),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _hooks_useAuth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks/useAuth */ \"./hooks/useAuth.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_hooks_useAuth__WEBPACK_IMPORTED_MODULE_2__]);\n_hooks_useAuth__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nconst UserContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);\nconst UserProvider = ({ children  })=>{\n    const { Login , Logout , user  } = (0,_hooks_useAuth__WEBPACK_IMPORTED_MODULE_2__[\"default\"])();\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(UserContext.Provider, {\n        value: {\n            Login,\n            Logout,\n            user\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/home/david/code/home_services/crm/context/UserContext.tsx\",\n        lineNumber: 20,\n        columnNumber: 5\n    }, undefined);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UserProvider);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0L1VzZXJDb250ZXh0LnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7QUFBd0Q7QUFDakI7QUFTaEMsTUFBTUcsNEJBQWNGLG9EQUFhQSxDQUFzQixJQUFJLEVBQUU7QUFNcEUsTUFBTUcsZUFBd0MsQ0FBQyxFQUFFQyxTQUFRLEVBQUUsR0FBSztJQUM5RCxNQUFNLEVBQUVDLE1BQUssRUFBRUMsT0FBTSxFQUFFQyxLQUFJLEVBQUUsR0FBR04sMERBQU9BO0lBQ3ZDLHFCQUNFLDhEQUFDQyxZQUFZTSxRQUFRO1FBQUNDLE9BQU87WUFBRUo7WUFBT0M7WUFBUUM7UUFBSztrQkFDaERIOzs7Ozs7QUFHUDtBQUVBLGlFQUFlRCxZQUFZQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY3JtLy4vY29udGV4dC9Vc2VyQ29udGV4dC50c3g/ZjVlNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCwgUmVhY3ROb2RlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgdXNlQXV0aCBmcm9tIFwiLi4vaG9va3MvdXNlQXV0aFwiO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuLi90eXBlcy9nZW5lcmFsXCI7XG5cbmludGVyZmFjZSBDb250ZXh0VmFsdWUge1xuICBMb2dpbjogKHVzZXI6IFVzZXIpID0+IHZvaWQ7XG4gIExvZ291dDogKCkgPT4gdm9pZDtcbiAgdXNlcjogVXNlcjtcbn1cblxuZXhwb3J0IGNvbnN0IFVzZXJDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxDb250ZXh0VmFsdWUgfCBudWxsPihudWxsKTtcblxuaW50ZXJmYWNlIFByb3ZpZGVyUHJvcHMge1xuICBjaGlsZHJlbjogUmVhY3ROb2RlO1xufVxuXG5jb25zdCBVc2VyUHJvdmlkZXI6IFJlYWN0LkZDPFByb3ZpZGVyUHJvcHM+ID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xuICBjb25zdCB7IExvZ2luLCBMb2dvdXQsIHVzZXIgfSA9IHVzZUF1dGgoKTtcbiAgcmV0dXJuIChcbiAgICA8VXNlckNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgTG9naW4sIExvZ291dCwgdXNlciB9fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1VzZXJDb250ZXh0LlByb3ZpZGVyPlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgVXNlclByb3ZpZGVyO1xuIl0sIm5hbWVzIjpbIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsInVzZUF1dGgiLCJVc2VyQ29udGV4dCIsIlVzZXJQcm92aWRlciIsImNoaWxkcmVuIiwiTG9naW4iLCJMb2dvdXQiLCJ1c2VyIiwiUHJvdmlkZXIiLCJ2YWx1ZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./context/UserContext.tsx\n");

/***/ }),

/***/ "./hooks/useAuth.ts":
/*!**************************!*\
  !*** ./hooks/useAuth.ts ***!
  \**************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ \"./constants.ts\");\n/* harmony import */ var _useFetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useFetch */ \"./hooks/useFetch.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_useFetch__WEBPACK_IMPORTED_MODULE_2__]);\n_useFetch__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nfunction useAuth() {\n    const { makeRequest  } = (0,_useFetch__WEBPACK_IMPORTED_MODULE_2__[\"default\"])();\n    let userProps = {\n        id: 0,\n        username: \"\",\n        password: \"\",\n        email: \"\",\n        profile_image: \"\",\n        created_at: \"\"\n    };\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(userProps);\n    function Login(user) {\n        setUser(user);\n    }\n    function Logout() {\n        makeRequest({\n            url: `${_constants__WEBPACK_IMPORTED_MODULE_1__.LOGOUT_ROUTE}`,\n            method: \"POST\"\n        }, (res)=>{\n            if (res.data.data === \"Logged out!\") {\n                setUser(userProps);\n            }\n        });\n    }\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{\n        makeRequest({\n            url: `${_constants__WEBPACK_IMPORTED_MODULE_1__.USER_ROUTE}`,\n            method: \"GET\"\n        }, (res)=>{\n            if (res.data.data.user) {\n                setUser(res.data.data.user);\n            }\n        });\n    }, [\n        makeRequest\n    ]);\n    return {\n        Login,\n        Logout,\n        user\n    };\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ob29rcy91c2VBdXRoLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQTRDO0FBQ1k7QUFFdEI7QUFFbkIsU0FBU0ssVUFBVTtJQUNoQyxNQUFNLEVBQUVDLFlBQVcsRUFBRSxHQUFHRixxREFBUUE7SUFDaEMsSUFBSUcsWUFBWTtRQUNkQyxJQUFJO1FBQ0pDLFVBQVU7UUFDVkMsVUFBVTtRQUNWQyxPQUFPO1FBQ1BDLGVBQWU7UUFDZkMsWUFBWTtJQUNkO0lBQ0EsTUFBTSxDQUFDQyxNQUFNQyxRQUFRLEdBQUdkLCtDQUFRQSxDQUFDTTtJQUVqQyxTQUFTUyxNQUFNRixJQUFVLEVBQUU7UUFDekJDLFFBQVFEO0lBQ1Y7SUFFQSxTQUFTRyxTQUFTO1FBQ2hCWCxZQUNFO1lBQ0VZLEtBQUssQ0FBQyxFQUFFaEIsb0RBQVlBLENBQUMsQ0FBQztZQUN0QmlCLFFBQVE7UUFDVixHQUNBLENBQUNDLE1BQVE7WUFDUCxJQUFJQSxJQUFJQyxJQUFJLENBQUNBLElBQUksS0FBSyxlQUFlO2dCQUNuQ04sUUFBUVI7WUFDVixDQUFDO1FBQ0g7SUFFSjtJQUVBUCxnREFBU0EsQ0FBQyxJQUFNO1FBQ2RNLFlBQ0U7WUFDRVksS0FBSyxDQUFDLEVBQUVmLGtEQUFVQSxDQUFDLENBQUM7WUFDcEJnQixRQUFRO1FBQ1YsR0FDQSxDQUFDQyxNQUFRO1lBQ1AsSUFBSUEsSUFBSUMsSUFBSSxDQUFDQSxJQUFJLENBQUNQLElBQUksRUFBRTtnQkFDdEJDLFFBQVFLLElBQUlDLElBQUksQ0FBQ0EsSUFBSSxDQUFDUCxJQUFJO1lBQzVCLENBQUM7UUFDSDtJQUVKLEdBQUc7UUFBQ1I7S0FBWTtJQUVoQixPQUFPO1FBQUVVO1FBQU9DO1FBQVFIO0lBQUs7QUFDL0IsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NybS8uL2hvb2tzL3VzZUF1dGgudHM/OWM3NiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBMT0dPVVRfUk9VVEUsIFVTRVJfUk9VVEUgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSBcIi4uL3R5cGVzL2dlbmVyYWxcIjtcbmltcG9ydCB1c2VGZXRjaCBmcm9tIFwiLi91c2VGZXRjaFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VBdXRoKCkge1xuICBjb25zdCB7IG1ha2VSZXF1ZXN0IH0gPSB1c2VGZXRjaCgpO1xuICBsZXQgdXNlclByb3BzID0ge1xuICAgIGlkOiAwLFxuICAgIHVzZXJuYW1lOiBcIlwiLFxuICAgIHBhc3N3b3JkOiBcIlwiLFxuICAgIGVtYWlsOiBcIlwiLFxuICAgIHByb2ZpbGVfaW1hZ2U6IFwiXCIsXG4gICAgY3JlYXRlZF9hdDogXCJcIixcbiAgfTtcbiAgY29uc3QgW3VzZXIsIHNldFVzZXJdID0gdXNlU3RhdGUodXNlclByb3BzKTtcblxuICBmdW5jdGlvbiBMb2dpbih1c2VyOiBVc2VyKSB7XG4gICAgc2V0VXNlcih1c2VyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIExvZ291dCgpIHtcbiAgICBtYWtlUmVxdWVzdChcbiAgICAgIHtcbiAgICAgICAgdXJsOiBgJHtMT0dPVVRfUk9VVEV9YCxcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIH0sXG4gICAgICAocmVzKSA9PiB7XG4gICAgICAgIGlmIChyZXMuZGF0YS5kYXRhID09PSBcIkxvZ2dlZCBvdXQhXCIpIHtcbiAgICAgICAgICBzZXRVc2VyKHVzZXJQcm9wcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBtYWtlUmVxdWVzdChcbiAgICAgIHtcbiAgICAgICAgdXJsOiBgJHtVU0VSX1JPVVRFfWAsXG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIH0sXG4gICAgICAocmVzKSA9PiB7XG4gICAgICAgIGlmIChyZXMuZGF0YS5kYXRhLnVzZXIpIHtcbiAgICAgICAgICBzZXRVc2VyKHJlcy5kYXRhLmRhdGEudXNlcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9LCBbbWFrZVJlcXVlc3RdKTtcblxuICByZXR1cm4geyBMb2dpbiwgTG9nb3V0LCB1c2VyIH07XG59XG4iXSwibmFtZXMiOlsidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJMT0dPVVRfUk9VVEUiLCJVU0VSX1JPVVRFIiwidXNlRmV0Y2giLCJ1c2VBdXRoIiwibWFrZVJlcXVlc3QiLCJ1c2VyUHJvcHMiLCJpZCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJlbWFpbCIsInByb2ZpbGVfaW1hZ2UiLCJjcmVhdGVkX2F0IiwidXNlciIsInNldFVzZXIiLCJMb2dpbiIsIkxvZ291dCIsInVybCIsIm1ldGhvZCIsInJlcyIsImRhdGEiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./hooks/useAuth.ts\n");

/***/ }),

/***/ "./hooks/useFetch.ts":
/*!***************************!*\
  !*** ./hooks/useFetch.ts ***!
  \***************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ useFetch)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ \"axios\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_1__]);\naxios__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nfunction useFetch() {\n    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({\n        message: \"\"\n    });\n    const cancelToken = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(()=>axios__WEBPACK_IMPORTED_MODULE_1__[\"default\"].CancelToken.source(), []);\n    const makeRequest = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (config, callback)=>{\n        setIsLoading(true);\n        setError({\n            message: \"\"\n        });\n        await (0,axios__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            url: config.url,\n            cancelToken: cancelToken.token,\n            method: config.method ? config.method : undefined,\n            headers: config.headers ? config.headers : undefined,\n            responseType: config.responseType ? config.responseType : undefined,\n            withCredentials: true,\n            data: config.data ? config.data : null,\n            validateStatus: function(status) {\n                return status < 400;\n            }\n        }).then((response)=>{\n            setIsLoading(false);\n            callback(response);\n        }).catch((error)=>{\n            if (error?.response?.data) {\n                setError({\n                    message: error.response.data.data\n                });\n            } else {\n                setError({\n                    message: error.message\n                });\n            }\n            setIsLoading(false);\n        });\n    }, [\n        cancelToken\n    ]);\n    const errorCallback = (callbackMessage)=>{\n        setError({\n            message: callbackMessage\n        });\n        setIsLoading(false);\n    };\n    return {\n        isLoading,\n        error,\n        makeRequest,\n        errorCallback,\n        cancelToken\n    };\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ob29rcy91c2VGZXRjaC50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQXVEO0FBQ1U7QUFFbEQsU0FBU0ksV0FBVztJQUNqQyxNQUFNLENBQUNDLFdBQVdDLGFBQWEsR0FBR0osK0NBQVFBLENBQUMsS0FBSztJQUNoRCxNQUFNLENBQUNLLE9BQU9DLFNBQVMsR0FBR04sK0NBQVFBLENBQUM7UUFBRU8sU0FBUztJQUFHO0lBQ2pELE1BQU1DLGNBQWNULDhDQUFPQSxDQUFDLElBQU1FLGdFQUF3QixJQUFJLEVBQUU7SUFFaEUsTUFBTVUsY0FBY2Isa0RBQVdBLENBQzdCLE9BQ0VjLFFBQ0FDLFdBQ0c7UUFDSFQsYUFBYSxJQUFJO1FBQ2pCRSxTQUFTO1lBQUVDLFNBQVM7UUFBRztRQUV2QixNQUFNTixpREFBS0EsQ0FBQztZQUNWYSxLQUFLRixPQUFPRSxHQUFHO1lBQ2ZOLGFBQWFBLFlBQVlPLEtBQUs7WUFDOUJDLFFBQVFKLE9BQU9JLE1BQU0sR0FBR0osT0FBT0ksTUFBTSxHQUFHQyxTQUFTO1lBQ2pEQyxTQUFTTixPQUFPTSxPQUFPLEdBQUdOLE9BQU9NLE9BQU8sR0FBR0QsU0FBUztZQUNwREUsY0FBY1AsT0FBT08sWUFBWSxHQUFHUCxPQUFPTyxZQUFZLEdBQUdGLFNBQVM7WUFDbkVHLGlCQUFpQixJQUFJO1lBQ3JCQyxNQUFNVCxPQUFPUyxJQUFJLEdBQUdULE9BQU9TLElBQUksR0FBRyxJQUFJO1lBQ3RDQyxnQkFBZ0IsU0FBVUMsTUFBTSxFQUFFO2dCQUNoQyxPQUFPQSxTQUFTO1lBQ2xCO1FBQ0YsR0FDR0MsSUFBSSxDQUFDLENBQUNDLFdBQWE7WUFDbEJyQixhQUFhLEtBQUs7WUFDbEJTLFNBQVNZO1FBQ1gsR0FDQ0MsS0FBSyxDQUFDLENBQUNyQixRQUFVO1lBQ2hCLElBQUlBLE9BQU9vQixVQUFVSixNQUFNO2dCQUN6QmYsU0FBUztvQkFBRUMsU0FBU0YsTUFBTW9CLFFBQVEsQ0FBQ0osSUFBSSxDQUFDQSxJQUFJO2dCQUFDO1lBQy9DLE9BQU87Z0JBQ0xmLFNBQVM7b0JBQUVDLFNBQVNGLE1BQU1FLE9BQU87Z0JBQUM7WUFDcEMsQ0FBQztZQUNESCxhQUFhLEtBQUs7UUFDcEI7SUFDSixHQUNBO1FBQUNJO0tBQVk7SUFHZixNQUFNbUIsZ0JBQWdCLENBQUNDLGtCQUE0QjtRQUNqRHRCLFNBQVM7WUFBRUMsU0FBU3FCO1FBQWdCO1FBQ3BDeEIsYUFBYSxLQUFLO0lBQ3BCO0lBRUEsT0FBTztRQUNMRDtRQUNBRTtRQUNBTTtRQUNBZ0I7UUFDQW5CO0lBQ0Y7QUFDRixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY3JtLy4vaG9va3MvdXNlRmV0Y2gudHM/NDhiMiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBheGlvcywgeyBBeGlvc1JlcXVlc3RDb25maWcsIEF4aW9zUmVzcG9uc2UgfSBmcm9tIFwiYXhpb3NcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlRmV0Y2goKSB7XG4gIGNvbnN0IFtpc0xvYWRpbmcsIHNldElzTG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGUoeyBtZXNzYWdlOiBcIlwiIH0pO1xuICBjb25zdCBjYW5jZWxUb2tlbiA9IHVzZU1lbW8oKCkgPT4gYXhpb3MuQ2FuY2VsVG9rZW4uc291cmNlKCksIFtdKTtcblxuICBjb25zdCBtYWtlUmVxdWVzdCA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChcbiAgICAgIGNvbmZpZzogQXhpb3NSZXF1ZXN0Q29uZmlnLFxuICAgICAgY2FsbGJhY2s6IChkYXRhOiBBeGlvc1Jlc3BvbnNlKSA9PiB2b2lkXG4gICAgKSA9PiB7XG4gICAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XG4gICAgICBzZXRFcnJvcih7IG1lc3NhZ2U6IFwiXCIgfSk7XG5cbiAgICAgIGF3YWl0IGF4aW9zKHtcbiAgICAgICAgdXJsOiBjb25maWcudXJsLFxuICAgICAgICBjYW5jZWxUb2tlbjogY2FuY2VsVG9rZW4udG9rZW4sXG4gICAgICAgIG1ldGhvZDogY29uZmlnLm1ldGhvZCA/IGNvbmZpZy5tZXRob2QgOiB1bmRlZmluZWQsXG4gICAgICAgIGhlYWRlcnM6IGNvbmZpZy5oZWFkZXJzID8gY29uZmlnLmhlYWRlcnMgOiB1bmRlZmluZWQsXG4gICAgICAgIHJlc3BvbnNlVHlwZTogY29uZmlnLnJlc3BvbnNlVHlwZSA/IGNvbmZpZy5yZXNwb25zZVR5cGUgOiB1bmRlZmluZWQsXG4gICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgZGF0YTogY29uZmlnLmRhdGEgPyBjb25maWcuZGF0YSA6IG51bGwsXG4gICAgICAgIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiAoc3RhdHVzKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXR1cyA8IDQwMDtcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIHNldElzTG9hZGluZyhmYWxzZSk7XG4gICAgICAgICAgY2FsbGJhY2socmVzcG9uc2UpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yPy5yZXNwb25zZT8uZGF0YSkge1xuICAgICAgICAgICAgc2V0RXJyb3IoeyBtZXNzYWdlOiBlcnJvci5yZXNwb25zZS5kYXRhLmRhdGEgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldEVycm9yKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBbY2FuY2VsVG9rZW5dXG4gICk7XG5cbiAgY29uc3QgZXJyb3JDYWxsYmFjayA9IChjYWxsYmFja01lc3NhZ2U6IHN0cmluZykgPT4ge1xuICAgIHNldEVycm9yKHsgbWVzc2FnZTogY2FsbGJhY2tNZXNzYWdlIH0pO1xuICAgIHNldElzTG9hZGluZyhmYWxzZSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpc0xvYWRpbmcsXG4gICAgZXJyb3IsXG4gICAgbWFrZVJlcXVlc3QsXG4gICAgZXJyb3JDYWxsYmFjayxcbiAgICBjYW5jZWxUb2tlbixcbiAgfTtcbn0iXSwibmFtZXMiOlsidXNlQ2FsbGJhY2siLCJ1c2VNZW1vIiwidXNlU3RhdGUiLCJheGlvcyIsInVzZUZldGNoIiwiaXNMb2FkaW5nIiwic2V0SXNMb2FkaW5nIiwiZXJyb3IiLCJzZXRFcnJvciIsIm1lc3NhZ2UiLCJjYW5jZWxUb2tlbiIsIkNhbmNlbFRva2VuIiwic291cmNlIiwibWFrZVJlcXVlc3QiLCJjb25maWciLCJjYWxsYmFjayIsInVybCIsInRva2VuIiwibWV0aG9kIiwidW5kZWZpbmVkIiwiaGVhZGVycyIsInJlc3BvbnNlVHlwZSIsIndpdGhDcmVkZW50aWFscyIsImRhdGEiLCJ2YWxpZGF0ZVN0YXR1cyIsInN0YXR1cyIsInRoZW4iLCJyZXNwb25zZSIsImNhdGNoIiwiZXJyb3JDYWxsYmFjayIsImNhbGxiYWNrTWVzc2FnZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./hooks/useFetch.ts\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _context_UserContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context/UserContext */ \"./context/UserContext.tsx\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @chakra-ui/react */ \"@chakra-ui/react\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_context_UserContext__WEBPACK_IMPORTED_MODULE_2__]);\n_context_UserContext__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\nfunction App({ Component , pageProps  }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__.ChakraProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_UserContext__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/home/david/code/home_services/crm/pages/_app.tsx\",\n                lineNumber: 10,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/home/david/code/home_services/crm/pages/_app.tsx\",\n            lineNumber: 9,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/david/code/home_services/crm/pages/_app.tsx\",\n        lineNumber: 8,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQStCO0FBRW1CO0FBQ0E7QUFFbkMsU0FBU0UsSUFBSSxFQUFFQyxVQUFTLEVBQUVDLFVBQVMsRUFBWSxFQUFFO0lBQzlELHFCQUNFLDhEQUFDSCw0REFBY0E7a0JBQ2IsNEVBQUNELDREQUFZQTtzQkFDWCw0RUFBQ0c7Z0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7Ozs7OztBQUloQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY3JtLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCIuLi9zdHlsZXMvZ2xvYmFscy5jc3NcIjtcbmltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tIFwibmV4dC9hcHBcIjtcbmltcG9ydCBVc2VyUHJvdmlkZXIgZnJvbSBcIi4uL2NvbnRleHQvVXNlckNvbnRleHRcIjtcbmltcG9ydCB7IENoYWtyYVByb3ZpZGVyIH0gZnJvbSAnQGNoYWtyYS11aS9yZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XG4gIHJldHVybiAoXG4gICAgPENoYWtyYVByb3ZpZGVyPlxuICAgICAgPFVzZXJQcm92aWRlcj5cbiAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgPC9Vc2VyUHJvdmlkZXI+XG4gICAgPC9DaGFrcmFQcm92aWRlcj5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJVc2VyUHJvdmlkZXIiLCJDaGFrcmFQcm92aWRlciIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@chakra-ui/react":
/*!***********************************!*\
  !*** external "@chakra-ui/react" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@chakra-ui/react");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("axios");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();