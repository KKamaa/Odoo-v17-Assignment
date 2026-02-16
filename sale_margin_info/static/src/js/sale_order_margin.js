/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import { jsonrpc } from "@web/core/network/rpc_service";

// Odoo v17.0 uses jsonrpc
const ajax = {
    jsonRpc(route, _callType, params) {
        return jsonrpc(route, params || {});
    },
};

publicWidget.registry.SaleMarginInfoPortal = publicWidget.Widget.extend({
    selector: ".o_portal_sale_margin_info",
    events: {
        click: "_onClickShowMarginInfo",
    },

    async _onClickShowMarginInfo(ev) {
        ev.preventDefault();

        const $button = $(ev.currentTarget);
        const orderId = parseInt($button.data("order-id"), 10);
        const $popup = $button.next(".o_sale_margin_info_popup");
        const $content = $popup.find(".o_sale_margin_info_content");

        if (!orderId || !$popup.length) {
            return;
        }

        if (!$popup.hasClass("d-none")) {
            $popup.slideUp(150, () => $popup.addClass("d-none"));
            return;
        }

        $content.html('<span class="text-muted">Loading...</span>');
        $popup.removeClass("d-none").hide().slideDown(150);

        try {
            const data = await ajax.jsonRpc(`/my/orders/${orderId}/margin_info`, "call", {});

            if (data && data.error) {
                $content.html(`<span class="text-danger">${_.escape(data.error)}</span>`);
                return;
            }

            const margin = Number(data.margin_percentage || 0).toFixed(2);
            const requiresApproval = Boolean(data.requires_manager_approval);
            const approvalText = requiresApproval ? "Yes" : "No";
            const approvalClass = requiresApproval ? "text-danger fw-bold" : "text-success fw-bold";

            $content.html(`
                <div class="d-flex justify-content-between gap-2">
                    <span>Margin Percentage</span>
                    <span class="fw-bold">${margin}%</span>
                </div>
                <div class="d-flex justify-content-between gap-2 mt-1">
                    <span>Manager Approval Required</span>
                    <span class="${approvalClass}">${approvalText}</span>
                </div>
            `);
        } catch (error) {
            $content.html('<span class="text-danger">Could not load margin information.</span>');
        }
    },
});
