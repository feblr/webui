"use strict";
exports.detectBrowser = function () {
    let nAgt = navigator.userAgent;
    let browserName = navigator.appName;
    let fullVersion = '' + parseFloat(navigator.appVersion);
    let majorVersion = parseInt(navigator.appVersion, 10);
    let nameOffset;
    let verOffset;
    let ix;
    // In Opera, the true version is after 'Opera' or after 'Version'
    if ((verOffset = nAgt.indexOf('Opera')) != -1) {
        browserName = 'Opera';
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf('Version')) != -1) {
            fullVersion = nAgt.substring(verOffset + 8);
        }
    }
    else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
        // In MSIE, the true version is after 'MSIE' in userAgent
        browserName = 'Microsoft Internet Explorer';
        fullVersion = nAgt.substring(verOffset + 5);
    }
    else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
        // In Chrome, the true version is after 'Chrome'
        browserName = 'Chrome';
        fullVersion = nAgt.substring(verOffset + 7);
    }
    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
        // In Safari, the true version is after 'Safari' or after 'Version'
        browserName = 'Safari';
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf('Version')) != -1) {
            fullVersion = nAgt.substring(verOffset + 8);
        }
    }
    else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
        // In Firefox, the true version is after 'Firefox'
        browserName = 'Firefox';
        fullVersion = nAgt.substring(verOffset + 8);
    }
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        // In most other browsers, 'name/version' is at the end of userAgent
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(';')) != -1) {
        fullVersion = fullVersion.substring(0, ix);
    }
    if ((ix = fullVersion.indexOf(' ')) != -1) {
        fullVersion = fullVersion.substring(0, ix);
    }
    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }
    return {
        browserName: browserName,
        fullVersion: fullVersion,
        majorVersion: majorVersion,
        appName: navigator.appName,
        userAgent: navigator.userAgent
    };
};
exports.detectOS = function () {
    // This script sets OSName letiable as follows:
    // 'Windows'    for all versions of Windows
    // 'MacOS'      for all versions of Macintosh OS
    // 'Linux'      for all versions of Linux
    // 'UNIX'       for all other UNIX flavors
    // 'Unknown OS' indicates failure to detect the OS
    let OSName = 'Unknown OS';
    if (navigator.appVersion.indexOf('Win') != -1) {
        OSName = 'Windows';
    }
    if (navigator.appVersion.indexOf('Mac') != -1) {
        OSName = 'MacOS';
    }
    if (navigator.appVersion.indexOf('X11') != -1) {
        OSName = 'UNIX';
    }
    if (navigator.appVersion.indexOf('Linux') != -1) {
        OSName = 'Linux';
    }
    return OSName;
};
//# sourceMappingURL=system.js.map