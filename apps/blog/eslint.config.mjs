import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 防止深层相对路径导入features模块内部实现
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../../**/features/**"],
              message: "不允许通过深层相对路径导入features模块内部实现。请使用包名导入，如 '@damon-stack/feature-cms'"
            },
            {
              group: ["../../../../**/features/**"],
              message: "不允许通过深层相对路径导入features模块内部实现。请使用包名导入，如 '@damon-stack/feature-cms'"
            },
            {
              group: ["../../../../../**/features/**"],
              message: "不允许通过深层相对路径导入features模块内部实现。请使用包名导入，如 '@damon-stack/feature-cms'"
            },
            {
              group: ["../../../../../../**/features/**"],
              message: "不允许通过深层相对路径导入features模块内部实现。请使用包名导入，如 '@damon-stack/feature-cms'"
            },
            {
              group: ["../../../../../../../**/features/**"],
              message: "不允许通过深层相对路径导入features模块内部实现。请使用包名导入，如 '@damon-stack/feature-cms'"
            }
          ]
        }
      ]
    }
  }
];

export default eslintConfig; 