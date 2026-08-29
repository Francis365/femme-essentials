(function () {
    "use strict";

    var CAMPAIGN_REFERENCE = "EM-NG-SEARCH";
    var WHATSAPP_NUMBER = "2348036114891";
    var CONSENT_KEY = "femme_measurement_consent_v1";
    var CONVERSION_DESTINATIONS = {
        phone: "AW-11335982502/hBcPCKXniuocEKa7tZ0q",
        whatsapp: "AW-11335982502/SWUmCKjniuocEKa7tZ0q"
    };
    var tagMeta = document.querySelector('meta[name="google-ads-tag"]');
    var tagId = tagMeta ? tagMeta.content.trim() : "";

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 500
    });

    function hasValidTagId() {
        return /^(AW|G)-[A-Z0-9-]+$/i.test(tagId);
    }

    function loadGoogleTag() {
        if (!hasValidTagId() || document.querySelector("script[data-femme-google-tag]")) return;
        var script = document.createElement("script");
        script.async = true;
        script.dataset.femmeGoogleTag = "true";
        script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(tagId);
        document.head.appendChild(script);
        window.gtag("js", new Date());
        window.gtag("config", tagId, { allow_ad_personalization_signals: false });
    }

    function applyConsent(choice) {
        var granted = choice === "granted";
        window.gtag("consent", "update", {
            ad_storage: granted ? "granted" : "denied",
            analytics_storage: granted ? "granted" : "denied",
            ad_user_data: granted ? "granted" : "denied",
            ad_personalization: "denied"
        });
        if (granted) loadGoogleTag();
        try { window.localStorage.setItem(CONSENT_KEY, choice); } catch (error) { /* Storage can be unavailable. */ }
        var panel = document.querySelector("[data-consent-panel]");
        if (panel) panel.hidden = true;
    }

    function savedConsent() {
        try { return window.localStorage.getItem(CONSENT_KEY); } catch (error) { return null; }
    }

    function showConsent() {
        var panel = document.querySelector("[data-consent-panel]");
        if (panel) panel.hidden = false;
    }

    function trackOrderStart(channel) {
        if (savedConsent() !== "granted" || !hasValidTagId()) return;
        var destination = CONVERSION_DESTINATIONS[channel];
        if (!destination) return;
        window.gtag("event", "conversion", {
            send_to: destination
        });
    }

    document.querySelectorAll(".whatsapp-link").forEach(function (link) {
        var product = link.dataset.product || "Emiral products";
        var message = "Hello FemmeEssencia, I would like to order " + product +
            ". Please confirm the current price, availability and delivery fee. Reference: " + CAMPAIGN_REFERENCE;
        link.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
        link.target = "_blank";
        link.rel = "noopener";
    });

    document.querySelectorAll("[data-order-channel]").forEach(function (link) {
        link.addEventListener("click", function () { trackOrderStart(link.dataset.orderChannel); });
    });

    var allowButton = document.querySelector("[data-consent-allow]");
    var denyButton = document.querySelector("[data-consent-deny]");
    if (allowButton) allowButton.addEventListener("click", function () { applyConsent("granted"); });
    if (denyButton) denyButton.addEventListener("click", function () { applyConsent("denied"); });
    document.querySelectorAll("[data-consent-settings]").forEach(function (button) {
        button.addEventListener("click", showConsent);
    });

    var consent = savedConsent();
    if (consent === "granted") {
        applyConsent("granted");
    } else if (consent === "denied") {
        applyConsent("denied");
    } else {
        showConsent();
    }

    var menuButton = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-menu]");
    if (menuButton && menu) {
        menuButton.addEventListener("click", function () {
            var open = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", String(!open));
            menu.classList.toggle("is-open", !open);
            document.body.classList.toggle("menu-open", !open);
        });
        menu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                menuButton.setAttribute("aria-expanded", "false");
                menu.classList.remove("is-open");
                document.body.classList.remove("menu-open");
            });
        });
    }

    var header = document.querySelector("[data-header]");
    function updateHeader() {
        if (header) header.classList.toggle("is-scrolled", window.scrollY > 20);
    }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    var revealItems = document.querySelectorAll("[data-reveal]");
    var showAll = function () { revealItems.forEach(function (item) { item.classList.add("is-visible"); }); };
    var animates = "IntersectionObserver" in window &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        !window.location.hash;

    if (animates) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(function (item) { observer.observe(item); });
        // The browser can restore a scroll position past items the observer has not
        // reported yet, which would leave the landing screen blank.
        var revealInView = function () {
            revealItems.forEach(function (item) {
                if (item.classList.contains("is-visible")) return;
                if (item.getBoundingClientRect().top < window.innerHeight) {
                    item.classList.add("is-visible");
                    observer.unobserve(item);
                }
            });
        };
        revealInView();
        window.addEventListener("load", revealInView);
        // Arriving on a deep link such as emiral.html#detox-tea lands mid-page, so drop
        // the animation entirely rather than risk showing an empty screen.
        window.addEventListener("hashchange", showAll);
    } else {
        showAll();
    }

    document.querySelectorAll("[data-year]").forEach(function (item) {
        item.textContent = new Date().getFullYear();
    });
}());
