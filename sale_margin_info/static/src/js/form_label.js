/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { FormLabel } from "@web/views/form/form_label";

patch(FormLabel.prototype, {
    get inlineStyle() {
        const opts = this.props?.fieldInfo?.options || {};
        let color = (opts.label_color || "").trim();
        let font_weight = parseInt((opts.font_weight || 500), 10);
        let field_type = (opts.field_type || "boolean").trim();
        if (!color) {
            return "";
        }

        if (!color.startsWith("#")) {
            color = `#${color}`;
        }

        const fieldName = this.props.fieldName;
        const record = this.props.record;
        const fieldDef = record?.fields?.[fieldName];
        const value = record?.data?.[fieldName];
        const isBoolean = fieldDef?.type === field_type;

        if (isBoolean && !value) {
            return "";
        }

        return `color: ${color}; !important; font-weight: ${font_weight}`;
    },
});
