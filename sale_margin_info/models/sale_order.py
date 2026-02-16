from odoo import api, fields, models, _
from odoo.tools.float_utils import float_round


class SaleOrder(models.Model):
    _inherit = "sale.order"

    margin_percentage = fields.Float(
        string="Margin Percentage",
        compute="_compute_margin_information",
        digits=(16, 2),
        store=True,
        readonly=True,
    )
    requires_manager_approval = fields.Boolean(
        string="Requires Manager Approval",
        compute="_compute_margin_information",
        store=True,
        readonly=True,
    )

    @api.depends("amount_total", "amount_untaxed")
    def _compute_margin_information(self):
        for order in self:
            if order.amount_untaxed:
                margin_percentage = (
                    (order.amount_total - order.amount_untaxed)
                    / order.amount_untaxed
                    * 100.0
                )
            else:
                margin_percentage = 0.0

            order.margin_percentage = float_round(margin_percentage, precision_digits=2)
            order.requires_manager_approval = order.margin_percentage < 10.0

    def action_request_sale_margin_approval(self):
        for order in self:
            order.message_post(
                body=_("Manager approval requested for low margin order."),
                subtype_xmlid="mail.mt_comment",
            )
            if order.state != "sent":
                order.write({"state": "sent"})
        return True
