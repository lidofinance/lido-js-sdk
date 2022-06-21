import path from 'path';
import fs from 'fs';
import tslib from 'tslib';
import ts from 'typescript';
import { topologicallySort, listWorkspaces } from 'yarn-workspaces-list';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

const excludedWorkspaces = ['.'];
const commonExternal = ['react/jsx-runtime'];

export default async () => {
  const packages = await listWorkspaces();
  const filteredPackages = packages.filter(
    ({ location }) => !excludedWorkspaces.includes(location),
  );
  const sortedPackages = topologicallySort(filteredPackages);

  const config = sortedPackages.map((packageData) => {
    const packageDir = packageData.location;
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(packageDir, 'package.json'), 'utf-8'),
    );
    const { dependencies, peerDependencies } = packageJson;
    const external = [
      ...commonExternal,
      ...Object.keys({ ...dependencies, ...peerDependencies }),
    ];

    const cjsDir = path.join(packageDir, path.dirname(packageJson.main));
    const esmDir = path.join(packageDir, path.dirname(packageJson.module));

    return {
      input: path.join(packageDir, 'src/index'),
      output: [
        {
          dir: cjsDir,
          preserveModulesRoot: path.join(packageDir, 'src'),
          preserveModules: true,
          format: 'cjs',
          exports: 'named',
        },
        {
          dir: esmDir,
          preserveModulesRoot: path.join(packageDir, 'src'),
          preserveModules: true,
          format: 'es',
          exports: 'named',
        },
      ],
      plugins: [
        del({ targets: path.join(packageDir, 'dist/*'), runOnce: true }),
        copy({
          targets: [
            {
              src: path.join(packageDir, 'src/generated/*.d.ts'),
              dest: [
                path.join(cjsDir, 'generated'),
                path.join(esmDir, 'generated'),
              ],
            },
          ],
          copyOnce: true,
        }),
        commonjs(),
        json(),
        resolve({ extensions: ['.ts', '.tsx'] }),
        typescript({
          tslib,
          typescript: ts,
          tsconfig: path.join(packageDir, 'tsconfig.json'),
          tsconfigOverride: {
            compilerOptions: {
              paths: { tslib: [require.resolve('tslib/tslib.d.ts')] },
            },
            exclude: ['node_modules', 'dist', '**/*.test.*'],
            include: ['src/**/*'],
          },
        }),
      ],
      external,
    };
  });

  return config;
};
