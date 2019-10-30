import { DirectiveNode, FieldNode, ArgumentNode } from 'graphql'
import { ArgumentNodeProps, argumentNode } from '../../node'
import {
  oneToManyGet,
  oneToManyCreate,
  oneToManyUpdate,
  oneToManyUpsert,
  oneToManyRemove,
} from '../crud'
import { getName } from '../../utils'
import { ArgumentApi, argumentApi } from '../apis'

//
// ─── ARGUMENTS API MIXIN ────────────────────────────────────────────────────────
//

/**
 * @category API Mixins
 */
export type ArgumentsMixinCompatibleNode = DirectiveNode | FieldNode

/**
 * @category API Mixins
 */
export interface ArgumentsApiMixin<This> {
  getArgumentNames(): string[]
  getArguments(): ArgumentApi[]

  hasArgument(argumentName: string): boolean
  getArgument(argumentName: string): ArgumentApi

  createArgument(props: ArgumentNode | ArgumentNodeProps): This
  updateArgument(argumentName: string, props: ArgumentNode | ArgumentNodeProps): This
  upsertArgument(props: ArgumentNode | ArgumentNodeProps): This
  removeArgument(argumentName: string): This
}

/**
 * @category API Mixins
 */
export function argumentsApiMixin<This>(
  node: ArgumentsMixinCompatibleNode,
): ArgumentsApiMixin<This> {
  return {
    getArgumentNames() {
      return (node.arguments || []).map(arg => arg.name.value)
    },

    hasArgument(argName) {
      return !!node.arguments && node.arguments.some(arg => arg.name.value === argName)
    },

    getArguments() {
      return (node.arguments || []).map(argumentApi)
    },

    getArgument(argName) {
      const arg = oneToManyGet<ArgumentNode>({
        node,
        key: 'arguments',
        elementName: argName,
        parentName: node.name.value,
      })

      return argumentApi(arg)
    },

    createArgument(props) {
      oneToManyCreate({
        node,
        key: 'arguments',
        elementName: getName(props.name),
        parentName: node.name.value,
        nodeCreateFn: argumentNode,
        props,
      })

      return this as any
    },

    updateArgument(argumentName, props) {
      oneToManyUpdate({
        node,
        key: 'arguments',
        elementName: argumentName,
        parentName: node.name.value,
        nodeCreateFn: argumentNode,
        props,
      })

      return this as any
    },

    upsertArgument(props) {
      oneToManyUpsert({
        node,
        key: 'arguments',
        elementName: getName(props.name),
        parentName: node.name.value,
        nodeCreateFn: argumentNode,
        props,
      })

      return this as any
    },

    removeArgument(argumentName) {
      oneToManyRemove({
        node,
        key: 'arguments',
        elementName: argumentName,
        parentName: node.name.value,
      })

      return this as any
    },
  }
}