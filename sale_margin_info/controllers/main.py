from odoo import http, _
from odoo.exceptions import AccessError, MissingError

from odoo.addons.sale.controllers.portal import CustomerPortal


class SaleMarginPortal(CustomerPortal):

    @http.route(
        ["/my/orders/<int:order_id>/margin_info"],
        type="json",
        auth="user",
        website=True,
    )
    def portal_order_margin_info(self, order_id, access_token=None, **kw):
        try:
            order_sudo = self._document_check_access(
                "sale.order", order_id, access_token=access_token
            )
        except (AccessError, MissingError):
            return {"error": _("You do not have access to this sale order.")}

        return {
            "margin_percentage": round(order_sudo.margin_percentage or 0.0, 2),
            "requires_manager_approval": bool(order_sudo.requires_manager_approval),
        }
