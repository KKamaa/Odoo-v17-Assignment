{
    "name": "Sale Margin Info",
    "summary": "Adds sale order margin approval information in backend and customer portal.",
    "author": "Kevin Kahumba",
    "website": "https://github.com/KKamaa/Odoo-v17-Assignment",
    "category": "Sales",
    "version": "17.0.1.0.0",
    "license": "LGPL-3",
    "depends": [
        "web",
        "sale_management",
        "website_sale",
    ],
    "data": [
        "views/sale_order_view.xml",
        "views/sale_order_template.xml",
    ],
    "assets": {
        'web.assets_backend': [
            '/sale_margin_info/static/src/xml/form_label.xml',
            '/sale_margin_info/static/src/js/form_label.js',
        ],
        "web.assets_frontend": [
            "/sale_margin_info/static/src/css/sale_order_popup.css",
            "/sale_margin_info/static/src/js/sale_order_margin.js",
        ],
    },
    "installable": True,
    "application": False,
}
