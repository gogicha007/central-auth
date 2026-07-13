import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type RoleModel = runtime.Types.Result.DefaultSelection<Prisma.$RolePayload>;
export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null;
    _min: RoleMinAggregateOutputType | null;
    _max: RoleMaxAggregateOutputType | null;
};
export type RoleMinAggregateOutputType = {
    id: string | null;
    organizationId: string | null;
    name: $Enums.RoleNames | null;
    description: string | null;
    isSystem: boolean | null;
};
export type RoleMaxAggregateOutputType = {
    id: string | null;
    organizationId: string | null;
    name: $Enums.RoleNames | null;
    description: string | null;
    isSystem: boolean | null;
};
export type RoleCountAggregateOutputType = {
    id: number;
    organizationId: number;
    name: number;
    description: number;
    isSystem: number;
    _all: number;
};
export type RoleMinAggregateInputType = {
    id?: true;
    organizationId?: true;
    name?: true;
    description?: true;
    isSystem?: true;
};
export type RoleMaxAggregateInputType = {
    id?: true;
    organizationId?: true;
    name?: true;
    description?: true;
    isSystem?: true;
};
export type RoleCountAggregateInputType = {
    id?: true;
    organizationId?: true;
    name?: true;
    description?: true;
    isSystem?: true;
    _all?: true;
};
export type RoleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput | Prisma.RoleOrderByWithRelationInput[];
    cursor?: Prisma.RoleWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RoleCountAggregateInputType;
    _min?: RoleMinAggregateInputType;
    _max?: RoleMaxAggregateInputType;
};
export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
    [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRole[P]> : Prisma.GetScalarType<T[P], AggregateRole[P]>;
};
export type RoleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithAggregationInput | Prisma.RoleOrderByWithAggregationInput[];
    by: Prisma.RoleScalarFieldEnum[] | Prisma.RoleScalarFieldEnum;
    having?: Prisma.RoleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RoleCountAggregateInputType | true;
    _min?: RoleMinAggregateInputType;
    _max?: RoleMaxAggregateInputType;
};
export type RoleGroupByOutputType = {
    id: string;
    organizationId: string;
    name: $Enums.RoleNames;
    description: string;
    isSystem: boolean;
    _count: RoleCountAggregateOutputType | null;
    _min: RoleMinAggregateOutputType | null;
    _max: RoleMaxAggregateOutputType | null;
};
export type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RoleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RoleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RoleGroupByOutputType[P]>;
}>>;
export type RoleWhereInput = {
    AND?: Prisma.RoleWhereInput | Prisma.RoleWhereInput[];
    OR?: Prisma.RoleWhereInput[];
    NOT?: Prisma.RoleWhereInput | Prisma.RoleWhereInput[];
    id?: Prisma.StringFilter<"Role"> | string;
    organizationId?: Prisma.StringFilter<"Role"> | string;
    name?: Prisma.EnumRoleNamesFilter<"Role"> | $Enums.RoleNames;
    description?: Prisma.StringFilter<"Role"> | string;
    isSystem?: Prisma.BoolFilter<"Role"> | boolean;
    organization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
    organizationMembers?: Prisma.OrganizationMemberListRelationFilter;
    rolePermissions?: Prisma.RolePermissionListRelationFilter;
    invitations?: Prisma.InvitationListRelationFilter;
};
export type RoleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isSystem?: Prisma.SortOrder;
    organization?: Prisma.OrganizationOrderByWithRelationInput;
    organizationMembers?: Prisma.OrganizationMemberOrderByRelationAggregateInput;
    rolePermissions?: Prisma.RolePermissionOrderByRelationAggregateInput;
    invitations?: Prisma.InvitationOrderByRelationAggregateInput;
};
export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RoleWhereInput | Prisma.RoleWhereInput[];
    OR?: Prisma.RoleWhereInput[];
    NOT?: Prisma.RoleWhereInput | Prisma.RoleWhereInput[];
    organizationId?: Prisma.StringFilter<"Role"> | string;
    name?: Prisma.EnumRoleNamesFilter<"Role"> | $Enums.RoleNames;
    description?: Prisma.StringFilter<"Role"> | string;
    isSystem?: Prisma.BoolFilter<"Role"> | boolean;
    organization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
    organizationMembers?: Prisma.OrganizationMemberListRelationFilter;
    rolePermissions?: Prisma.RolePermissionListRelationFilter;
    invitations?: Prisma.InvitationListRelationFilter;
}, "id">;
export type RoleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isSystem?: Prisma.SortOrder;
    _count?: Prisma.RoleCountOrderByAggregateInput;
    _max?: Prisma.RoleMaxOrderByAggregateInput;
    _min?: Prisma.RoleMinOrderByAggregateInput;
};
export type RoleScalarWhereWithAggregatesInput = {
    AND?: Prisma.RoleScalarWhereWithAggregatesInput | Prisma.RoleScalarWhereWithAggregatesInput[];
    OR?: Prisma.RoleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RoleScalarWhereWithAggregatesInput | Prisma.RoleScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Role"> | string;
    organizationId?: Prisma.StringWithAggregatesFilter<"Role"> | string;
    name?: Prisma.EnumRoleNamesWithAggregatesFilter<"Role"> | $Enums.RoleNames;
    description?: Prisma.StringWithAggregatesFilter<"Role"> | string;
    isSystem?: Prisma.BoolWithAggregatesFilter<"Role"> | boolean;
};
export type RoleCreateInput = {
    id?: string;
    name?: $Enums.RoleNames;
    description: string;
    isSystem?: boolean;
    organization: Prisma.OrganizationCreateNestedOneWithoutRolesInput;
    organizationMembers?: Prisma.OrganizationMemberCreateNestedManyWithoutRoleInput;
    rolePermissions?: Prisma.RolePermissionCreateNestedManyWithoutRoleInput;
    invitations?: Prisma.InvitationCreateNestedManyWithoutRoleInput;
};
export type RoleUncheckedCreateInput = {
    id?: string;
    organizationId: string;
    name?: $Enums.RoleNames;
    description: string;
    isSystem?: boolean;
    organizationMembers?: Prisma.OrganizationMemberUncheckedCreateNestedManyWithoutRoleInput;
    rolePermissions?: Prisma.RolePermissionUncheckedCreateNestedManyWithoutRoleInput;
    invitations?: Prisma.InvitationUncheckedCreateNestedManyWithoutRoleInput;
};
export type RoleUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.EnumRoleNamesFieldUpdateOperationsInput | $Enums.RoleNames;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutRolesNestedInput;
    organizationMembers?: Prisma.OrganizationMemberUpdateManyWithoutRoleNestedInput;
    rolePermissions?: Prisma.RolePermissionUpdateManyWithoutRoleNestedInput;
    invitations?: Prisma.InvitationUpdateManyWithoutRoleNestedInput;
};
export type RoleUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.EnumRoleNamesFieldUpdateOperationsInput | $Enums.RoleNames;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    organizationMembers?: Prisma.OrganizationMemberUncheckedUpdateManyWithoutRoleNestedInput;
    rolePermissions?: Prisma.RolePermissionUncheckedUpdateManyWithoutRoleNestedInput;
    invitations?: Prisma.InvitationUncheckedUpdateManyWithoutRoleNestedInput;
};
export type RoleCreateManyInput = {
    id?: string;
    organizationId: string;
    name?: $Enums.RoleNames;
    description: string;
    isSystem?: boolean;
};
export type RoleUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.EnumRoleNamesFieldUpdateOperationsInput | $Enums.RoleNames;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RoleUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.EnumRoleNamesFieldUpdateOperationsInput | $Enums.RoleNames;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RoleListRelationFilter = {
    every?: Prisma.RoleWhereInput;
    some?: Prisma.RoleWhereInput;
    none?: Prisma.RoleWhereInput;
};
export type RoleOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RoleScalarRelationFilter = {
    is?: Prisma.RoleWhereInput;
    isNot?: Prisma.RoleWhereInput;
};
export type RoleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isSystem?: Prisma.SortOrder;
};
export type RoleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isSystem?: Prisma.SortOrder;
};
export type RoleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isSystem?: Prisma.SortOrder;
};
export type RoleCreateNestedManyWithoutOrganizationInput = {
    create?: Prisma.XOR<Prisma.RoleCreateWithoutOrganizationInput, Prisma.RoleUncheckedCreateWithoutOrganizationInput> | Prisma.RoleCreateWithoutOrganizationInput[] | Prisma.RoleUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.RoleCreateOrConnectWithoutOrganizationInput | Prisma.RoleCreateOrConnectWithoutOrganizationInput[];
    createMany?: Prisma.RoleCreateManyOrganizationInputEnvelope;
    connect?: Prisma.RoleWhereUniqueInput | Prisma.RoleWhereUniqueInput[];
};
export type RoleUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: Prisma.XOR<Prisma.RoleCreateWithoutOrganizationInput, Prisma.RoleUncheckedCreateWithoutOrganizationInput> | Prisma.RoleCreateWithoutOrganizationInput[] | Prisma.RoleUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.RoleCreateOrConnectWithoutOrganizationInput | Prisma.RoleCreateOrConnectWithoutOrganizationInput[];
    createMany?: Prisma.RoleCreateManyOrganizationInputEnvelope;
    connect?: Prisma.RoleWhereUniqueInput | Prisma.RoleWhereUniqueInput[];
};
export type RoleUpdateManyWithoutOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.RoleCreateWithoutOrganizationInput, Prisma.RoleUncheckedCreateWithoutOrganizationInput> | Prisma.RoleCreateWithoutOrganizationInput[] | Prisma.RoleUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.RoleCreateOrConnectWithoutOrganizationInput | Prisma.RoleCreateOrConnectWithoutOrganizationInput[];
    upsert?: Prisma.RoleUpsertWithWhereUniqueWithoutOrganizationInput | Prisma.RoleUpsertWithWhereUniqueWithoutOrganizationInput[];
    createMany?: Prisma.RoleCreateManyOrganizationInputEnvelope;
    set?: Prisma.RoleWhereUniqueInput | Prisma.RoleWhereUniqueInput[];
    disconnect?: Prisma.RoleWhereUniqueInput | Prisma.RoleWhereUniqueInput[];
    delete?: Prisma.RoleWhereUniqueInput | Prisma.RoleWhereUniqueInput[];
    connect?: Prisma.RoleWhereUniqueInput | Prisma.RoleWhereUniqueInput[];
    update?: Prisma.RoleUpdateWithWhereUniqueWithoutOrganizationInput | Prisma.RoleUpdateWithWhereUniqueWithoutOrganizationInput[];
    updateMany?: Prisma.RoleUpdateManyWithWhereWithoutOrganizationInput | Prisma.RoleUpdateManyWithWhereWithoutOrganizationInput[];
    deleteMany?: Prisma.RoleScalarWhereInput | Prisma.RoleScalarWhereInput[];
};
export type RoleUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.RoleCreateWithoutOrganizationInput, Prisma.RoleUncheckedCreateWithoutOrganizationInput> | Prisma.RoleCreateWithoutOrganizationInput[] | Prisma.RoleUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.RoleCreateOrConnectWithoutOrganizationInput | Prisma.RoleCreateOrConnectWithoutOrganizationInput[];
    upsert?: Prisma.RoleUpsertWithWhereUniqueWithoutOrganizationInput | Prisma.RoleUpsertWithWhereUniqueWithoutOrganizationInput[];
    createMany?: Prisma.RoleCreateManyOrganizationInputEnvelope;
    set?: Prisma.RoleWhereUniqueInput | Prisma.RoleWhereUniqueInput[];
    disconnect?: Prisma.RoleWhereUniqueInput | Prisma.RoleWhereUniqueInput[];
    delete?: Prisma.RoleWhereUniqueInput | Prisma.RoleWhereUniqueInput[];
    connect?: Prisma.RoleWhereUniqueInput | Prisma.RoleWhereUniqueInput[];
    update?: Prisma.RoleUpdateWithWhereUniqueWithoutOrganizationInput | Prisma.RoleUpdateWithWhereUniqueWithoutOrganizationInput[];
    updateMany?: Prisma.RoleUpdateManyWithWhereWithoutOrganizationInput | Prisma.RoleUpdateManyWithWhereWithoutOrganizationInput[];
    deleteMany?: Prisma.RoleScalarWhereInput | Prisma.RoleScalarWhereInput[];
};
export type RoleCreateNestedOneWithoutOrganizationMembersInput = {
    create?: Prisma.XOR<Prisma.RoleCreateWithoutOrganizationMembersInput, Prisma.RoleUncheckedCreateWithoutOrganizationMembersInput>;
    connectOrCreate?: Prisma.RoleCreateOrConnectWithoutOrganizationMembersInput;
    connect?: Prisma.RoleWhereUniqueInput;
};
export type RoleUpdateOneRequiredWithoutOrganizationMembersNestedInput = {
    create?: Prisma.XOR<Prisma.RoleCreateWithoutOrganizationMembersInput, Prisma.RoleUncheckedCreateWithoutOrganizationMembersInput>;
    connectOrCreate?: Prisma.RoleCreateOrConnectWithoutOrganizationMembersInput;
    upsert?: Prisma.RoleUpsertWithoutOrganizationMembersInput;
    connect?: Prisma.RoleWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.RoleUpdateToOneWithWhereWithoutOrganizationMembersInput, Prisma.RoleUpdateWithoutOrganizationMembersInput>, Prisma.RoleUncheckedUpdateWithoutOrganizationMembersInput>;
};
export type EnumRoleNamesFieldUpdateOperationsInput = {
    set?: $Enums.RoleNames;
};
export type RoleCreateNestedOneWithoutRolePermissionsInput = {
    create?: Prisma.XOR<Prisma.RoleCreateWithoutRolePermissionsInput, Prisma.RoleUncheckedCreateWithoutRolePermissionsInput>;
    connectOrCreate?: Prisma.RoleCreateOrConnectWithoutRolePermissionsInput;
    connect?: Prisma.RoleWhereUniqueInput;
};
export type RoleUpdateOneRequiredWithoutRolePermissionsNestedInput = {
    create?: Prisma.XOR<Prisma.RoleCreateWithoutRolePermissionsInput, Prisma.RoleUncheckedCreateWithoutRolePermissionsInput>;
    connectOrCreate?: Prisma.RoleCreateOrConnectWithoutRolePermissionsInput;
    upsert?: Prisma.RoleUpsertWithoutRolePermissionsInput;
    connect?: Prisma.RoleWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.RoleUpdateToOneWithWhereWithoutRolePermissionsInput, Prisma.RoleUpdateWithoutRolePermissionsInput>, Prisma.RoleUncheckedUpdateWithoutRolePermissionsInput>;
};
export type RoleCreateNestedOneWithoutInvitationsInput = {
    create?: Prisma.XOR<Prisma.RoleCreateWithoutInvitationsInput, Prisma.RoleUncheckedCreateWithoutInvitationsInput>;
    connectOrCreate?: Prisma.RoleCreateOrConnectWithoutInvitationsInput;
    connect?: Prisma.RoleWhereUniqueInput;
};
export type RoleUpdateOneRequiredWithoutInvitationsNestedInput = {
    create?: Prisma.XOR<Prisma.RoleCreateWithoutInvitationsInput, Prisma.RoleUncheckedCreateWithoutInvitationsInput>;
    connectOrCreate?: Prisma.RoleCreateOrConnectWithoutInvitationsInput;
    upsert?: Prisma.RoleUpsertWithoutInvitationsInput;
    connect?: Prisma.RoleWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.RoleUpdateToOneWithWhereWithoutInvitationsInput, Prisma.RoleUpdateWithoutInvitationsInput>, Prisma.RoleUncheckedUpdateWithoutInvitationsInput>;
};
export type RoleCreateWithoutOrganizationInput = {
    id?: string;
    name?: $Enums.RoleNames;
    description: string;
    isSystem?: boolean;
    organizationMembers?: Prisma.OrganizationMemberCreateNestedManyWithoutRoleInput;
    rolePermissions?: Prisma.RolePermissionCreateNestedManyWithoutRoleInput;
    invitations?: Prisma.InvitationCreateNestedManyWithoutRoleInput;
};
export type RoleUncheckedCreateWithoutOrganizationInput = {
    id?: string;
    name?: $Enums.RoleNames;
    description: string;
    isSystem?: boolean;
    organizationMembers?: Prisma.OrganizationMemberUncheckedCreateNestedManyWithoutRoleInput;
    rolePermissions?: Prisma.RolePermissionUncheckedCreateNestedManyWithoutRoleInput;
    invitations?: Prisma.InvitationUncheckedCreateNestedManyWithoutRoleInput;
};
export type RoleCreateOrConnectWithoutOrganizationInput = {
    where: Prisma.RoleWhereUniqueInput;
    create: Prisma.XOR<Prisma.RoleCreateWithoutOrganizationInput, Prisma.RoleUncheckedCreateWithoutOrganizationInput>;
};
export type RoleCreateManyOrganizationInputEnvelope = {
    data: Prisma.RoleCreateManyOrganizationInput | Prisma.RoleCreateManyOrganizationInput[];
    skipDuplicates?: boolean;
};
export type RoleUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: Prisma.RoleWhereUniqueInput;
    update: Prisma.XOR<Prisma.RoleUpdateWithoutOrganizationInput, Prisma.RoleUncheckedUpdateWithoutOrganizationInput>;
    create: Prisma.XOR<Prisma.RoleCreateWithoutOrganizationInput, Prisma.RoleUncheckedCreateWithoutOrganizationInput>;
};
export type RoleUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: Prisma.RoleWhereUniqueInput;
    data: Prisma.XOR<Prisma.RoleUpdateWithoutOrganizationInput, Prisma.RoleUncheckedUpdateWithoutOrganizationInput>;
};
export type RoleUpdateManyWithWhereWithoutOrganizationInput = {
    where: Prisma.RoleScalarWhereInput;
    data: Prisma.XOR<Prisma.RoleUpdateManyMutationInput, Prisma.RoleUncheckedUpdateManyWithoutOrganizationInput>;
};
export type RoleScalarWhereInput = {
    AND?: Prisma.RoleScalarWhereInput | Prisma.RoleScalarWhereInput[];
    OR?: Prisma.RoleScalarWhereInput[];
    NOT?: Prisma.RoleScalarWhereInput | Prisma.RoleScalarWhereInput[];
    id?: Prisma.StringFilter<"Role"> | string;
    organizationId?: Prisma.StringFilter<"Role"> | string;
    name?: Prisma.EnumRoleNamesFilter<"Role"> | $Enums.RoleNames;
    description?: Prisma.StringFilter<"Role"> | string;
    isSystem?: Prisma.BoolFilter<"Role"> | boolean;
};
export type RoleCreateWithoutOrganizationMembersInput = {
    id?: string;
    name?: $Enums.RoleNames;
    description: string;
    isSystem?: boolean;
    organization: Prisma.OrganizationCreateNestedOneWithoutRolesInput;
    rolePermissions?: Prisma.RolePermissionCreateNestedManyWithoutRoleInput;
    invitations?: Prisma.InvitationCreateNestedManyWithoutRoleInput;
};
export type RoleUncheckedCreateWithoutOrganizationMembersInput = {
    id?: string;
    organizationId: string;
    name?: $Enums.RoleNames;
    description: string;
    isSystem?: boolean;
    rolePermissions?: Prisma.RolePermissionUncheckedCreateNestedManyWithoutRoleInput;
    invitations?: Prisma.InvitationUncheckedCreateNestedManyWithoutRoleInput;
};
export type RoleCreateOrConnectWithoutOrganizationMembersInput = {
    where: Prisma.RoleWhereUniqueInput;
    create: Prisma.XOR<Prisma.RoleCreateWithoutOrganizationMembersInput, Prisma.RoleUncheckedCreateWithoutOrganizationMembersInput>;
};
export type RoleUpsertWithoutOrganizationMembersInput = {
    update: Prisma.XOR<Prisma.RoleUpdateWithoutOrganizationMembersInput, Prisma.RoleUncheckedUpdateWithoutOrganizationMembersInput>;
    create: Prisma.XOR<Prisma.RoleCreateWithoutOrganizationMembersInput, Prisma.RoleUncheckedCreateWithoutOrganizationMembersInput>;
    where?: Prisma.RoleWhereInput;
};
export type RoleUpdateToOneWithWhereWithoutOrganizationMembersInput = {
    where?: Prisma.RoleWhereInput;
    data: Prisma.XOR<Prisma.RoleUpdateWithoutOrganizationMembersInput, Prisma.RoleUncheckedUpdateWithoutOrganizationMembersInput>;
};
export type RoleUpdateWithoutOrganizationMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.EnumRoleNamesFieldUpdateOperationsInput | $Enums.RoleNames;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutRolesNestedInput;
    rolePermissions?: Prisma.RolePermissionUpdateManyWithoutRoleNestedInput;
    invitations?: Prisma.InvitationUpdateManyWithoutRoleNestedInput;
};
export type RoleUncheckedUpdateWithoutOrganizationMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.EnumRoleNamesFieldUpdateOperationsInput | $Enums.RoleNames;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rolePermissions?: Prisma.RolePermissionUncheckedUpdateManyWithoutRoleNestedInput;
    invitations?: Prisma.InvitationUncheckedUpdateManyWithoutRoleNestedInput;
};
export type RoleCreateWithoutRolePermissionsInput = {
    id?: string;
    name?: $Enums.RoleNames;
    description: string;
    isSystem?: boolean;
    organization: Prisma.OrganizationCreateNestedOneWithoutRolesInput;
    organizationMembers?: Prisma.OrganizationMemberCreateNestedManyWithoutRoleInput;
    invitations?: Prisma.InvitationCreateNestedManyWithoutRoleInput;
};
export type RoleUncheckedCreateWithoutRolePermissionsInput = {
    id?: string;
    organizationId: string;
    name?: $Enums.RoleNames;
    description: string;
    isSystem?: boolean;
    organizationMembers?: Prisma.OrganizationMemberUncheckedCreateNestedManyWithoutRoleInput;
    invitations?: Prisma.InvitationUncheckedCreateNestedManyWithoutRoleInput;
};
export type RoleCreateOrConnectWithoutRolePermissionsInput = {
    where: Prisma.RoleWhereUniqueInput;
    create: Prisma.XOR<Prisma.RoleCreateWithoutRolePermissionsInput, Prisma.RoleUncheckedCreateWithoutRolePermissionsInput>;
};
export type RoleUpsertWithoutRolePermissionsInput = {
    update: Prisma.XOR<Prisma.RoleUpdateWithoutRolePermissionsInput, Prisma.RoleUncheckedUpdateWithoutRolePermissionsInput>;
    create: Prisma.XOR<Prisma.RoleCreateWithoutRolePermissionsInput, Prisma.RoleUncheckedCreateWithoutRolePermissionsInput>;
    where?: Prisma.RoleWhereInput;
};
export type RoleUpdateToOneWithWhereWithoutRolePermissionsInput = {
    where?: Prisma.RoleWhereInput;
    data: Prisma.XOR<Prisma.RoleUpdateWithoutRolePermissionsInput, Prisma.RoleUncheckedUpdateWithoutRolePermissionsInput>;
};
export type RoleUpdateWithoutRolePermissionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.EnumRoleNamesFieldUpdateOperationsInput | $Enums.RoleNames;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutRolesNestedInput;
    organizationMembers?: Prisma.OrganizationMemberUpdateManyWithoutRoleNestedInput;
    invitations?: Prisma.InvitationUpdateManyWithoutRoleNestedInput;
};
export type RoleUncheckedUpdateWithoutRolePermissionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.EnumRoleNamesFieldUpdateOperationsInput | $Enums.RoleNames;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    organizationMembers?: Prisma.OrganizationMemberUncheckedUpdateManyWithoutRoleNestedInput;
    invitations?: Prisma.InvitationUncheckedUpdateManyWithoutRoleNestedInput;
};
export type RoleCreateWithoutInvitationsInput = {
    id?: string;
    name?: $Enums.RoleNames;
    description: string;
    isSystem?: boolean;
    organization: Prisma.OrganizationCreateNestedOneWithoutRolesInput;
    organizationMembers?: Prisma.OrganizationMemberCreateNestedManyWithoutRoleInput;
    rolePermissions?: Prisma.RolePermissionCreateNestedManyWithoutRoleInput;
};
export type RoleUncheckedCreateWithoutInvitationsInput = {
    id?: string;
    organizationId: string;
    name?: $Enums.RoleNames;
    description: string;
    isSystem?: boolean;
    organizationMembers?: Prisma.OrganizationMemberUncheckedCreateNestedManyWithoutRoleInput;
    rolePermissions?: Prisma.RolePermissionUncheckedCreateNestedManyWithoutRoleInput;
};
export type RoleCreateOrConnectWithoutInvitationsInput = {
    where: Prisma.RoleWhereUniqueInput;
    create: Prisma.XOR<Prisma.RoleCreateWithoutInvitationsInput, Prisma.RoleUncheckedCreateWithoutInvitationsInput>;
};
export type RoleUpsertWithoutInvitationsInput = {
    update: Prisma.XOR<Prisma.RoleUpdateWithoutInvitationsInput, Prisma.RoleUncheckedUpdateWithoutInvitationsInput>;
    create: Prisma.XOR<Prisma.RoleCreateWithoutInvitationsInput, Prisma.RoleUncheckedCreateWithoutInvitationsInput>;
    where?: Prisma.RoleWhereInput;
};
export type RoleUpdateToOneWithWhereWithoutInvitationsInput = {
    where?: Prisma.RoleWhereInput;
    data: Prisma.XOR<Prisma.RoleUpdateWithoutInvitationsInput, Prisma.RoleUncheckedUpdateWithoutInvitationsInput>;
};
export type RoleUpdateWithoutInvitationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.EnumRoleNamesFieldUpdateOperationsInput | $Enums.RoleNames;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutRolesNestedInput;
    organizationMembers?: Prisma.OrganizationMemberUpdateManyWithoutRoleNestedInput;
    rolePermissions?: Prisma.RolePermissionUpdateManyWithoutRoleNestedInput;
};
export type RoleUncheckedUpdateWithoutInvitationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.EnumRoleNamesFieldUpdateOperationsInput | $Enums.RoleNames;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    organizationMembers?: Prisma.OrganizationMemberUncheckedUpdateManyWithoutRoleNestedInput;
    rolePermissions?: Prisma.RolePermissionUncheckedUpdateManyWithoutRoleNestedInput;
};
export type RoleCreateManyOrganizationInput = {
    id?: string;
    name?: $Enums.RoleNames;
    description: string;
    isSystem?: boolean;
};
export type RoleUpdateWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.EnumRoleNamesFieldUpdateOperationsInput | $Enums.RoleNames;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    organizationMembers?: Prisma.OrganizationMemberUpdateManyWithoutRoleNestedInput;
    rolePermissions?: Prisma.RolePermissionUpdateManyWithoutRoleNestedInput;
    invitations?: Prisma.InvitationUpdateManyWithoutRoleNestedInput;
};
export type RoleUncheckedUpdateWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.EnumRoleNamesFieldUpdateOperationsInput | $Enums.RoleNames;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    organizationMembers?: Prisma.OrganizationMemberUncheckedUpdateManyWithoutRoleNestedInput;
    rolePermissions?: Prisma.RolePermissionUncheckedUpdateManyWithoutRoleNestedInput;
    invitations?: Prisma.InvitationUncheckedUpdateManyWithoutRoleNestedInput;
};
export type RoleUncheckedUpdateManyWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.EnumRoleNamesFieldUpdateOperationsInput | $Enums.RoleNames;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    isSystem?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RoleCountOutputType = {
    organizationMembers: number;
    rolePermissions: number;
    invitations: number;
};
export type RoleCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organizationMembers?: boolean | RoleCountOutputTypeCountOrganizationMembersArgs;
    rolePermissions?: boolean | RoleCountOutputTypeCountRolePermissionsArgs;
    invitations?: boolean | RoleCountOutputTypeCountInvitationsArgs;
};
export type RoleCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleCountOutputTypeSelect<ExtArgs> | null;
};
export type RoleCountOutputTypeCountOrganizationMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrganizationMemberWhereInput;
};
export type RoleCountOutputTypeCountRolePermissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RolePermissionWhereInput;
};
export type RoleCountOutputTypeCountInvitationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InvitationWhereInput;
};
export type RoleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    name?: boolean;
    description?: boolean;
    isSystem?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    organizationMembers?: boolean | Prisma.Role$organizationMembersArgs<ExtArgs>;
    rolePermissions?: boolean | Prisma.Role$rolePermissionsArgs<ExtArgs>;
    invitations?: boolean | Prisma.Role$invitationsArgs<ExtArgs>;
    _count?: boolean | Prisma.RoleCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["role"]>;
export type RoleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    name?: boolean;
    description?: boolean;
    isSystem?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["role"]>;
export type RoleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    name?: boolean;
    description?: boolean;
    isSystem?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["role"]>;
export type RoleSelectScalar = {
    id?: boolean;
    organizationId?: boolean;
    name?: boolean;
    description?: boolean;
    isSystem?: boolean;
};
export type RoleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "organizationId" | "name" | "description" | "isSystem", ExtArgs["result"]["role"]>;
export type RoleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    organizationMembers?: boolean | Prisma.Role$organizationMembersArgs<ExtArgs>;
    rolePermissions?: boolean | Prisma.Role$rolePermissionsArgs<ExtArgs>;
    invitations?: boolean | Prisma.Role$invitationsArgs<ExtArgs>;
    _count?: boolean | Prisma.RoleCountOutputTypeDefaultArgs<ExtArgs>;
};
export type RoleIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
};
export type RoleIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
};
export type $RolePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Role";
    objects: {
        organization: Prisma.$OrganizationPayload<ExtArgs>;
        organizationMembers: Prisma.$OrganizationMemberPayload<ExtArgs>[];
        rolePermissions: Prisma.$RolePermissionPayload<ExtArgs>[];
        invitations: Prisma.$InvitationPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        organizationId: string;
        name: $Enums.RoleNames;
        description: string;
        isSystem: boolean;
    }, ExtArgs["result"]["role"]>;
    composites: {};
};
export type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RolePayload, S>;
export type RoleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RoleCountAggregateInputType | true;
};
export interface RoleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Role'];
        meta: {
            name: 'Role';
        };
    };
    findUnique<T extends RoleFindUniqueArgs>(args: Prisma.SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RoleClient<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RoleClient<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RoleFindFirstArgs>(args?: Prisma.SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma.Prisma__RoleClient<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RoleClient<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RoleFindManyArgs>(args?: Prisma.SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RoleCreateArgs>(args: Prisma.SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma.Prisma__RoleClient<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RoleCreateManyArgs>(args?: Prisma.SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RoleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RoleDeleteArgs>(args: Prisma.SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma.Prisma__RoleClient<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RoleUpdateArgs>(args: Prisma.SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma.Prisma__RoleClient<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RoleDeleteManyArgs>(args?: Prisma.SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RoleUpdateManyArgs>(args: Prisma.SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RoleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RoleUpsertArgs>(args: Prisma.SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma.Prisma__RoleClient<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RoleCountArgs>(args?: Prisma.Subset<T, RoleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RoleCountAggregateOutputType> : number>;
    aggregate<T extends RoleAggregateArgs>(args: Prisma.Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>;
    groupBy<T extends RoleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RoleGroupByArgs['orderBy'];
    } : {
        orderBy?: RoleGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RoleFieldRefs;
}
export interface Prisma__RoleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    organization<T extends Prisma.OrganizationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrganizationDefaultArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    organizationMembers<T extends Prisma.Role$organizationMembersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Role$organizationMembersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrganizationMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    rolePermissions<T extends Prisma.Role$rolePermissionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Role$rolePermissionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    invitations<T extends Prisma.Role$invitationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Role$invitationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RoleFieldRefs {
    readonly id: Prisma.FieldRef<"Role", 'String'>;
    readonly organizationId: Prisma.FieldRef<"Role", 'String'>;
    readonly name: Prisma.FieldRef<"Role", 'RoleNames'>;
    readonly description: Prisma.FieldRef<"Role", 'String'>;
    readonly isSystem: Prisma.FieldRef<"Role", 'Boolean'>;
}
export type RoleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleSelect<ExtArgs> | null;
    omit?: Prisma.RoleOmit<ExtArgs> | null;
    include?: Prisma.RoleInclude<ExtArgs> | null;
    where: Prisma.RoleWhereUniqueInput;
};
export type RoleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleSelect<ExtArgs> | null;
    omit?: Prisma.RoleOmit<ExtArgs> | null;
    include?: Prisma.RoleInclude<ExtArgs> | null;
    where: Prisma.RoleWhereUniqueInput;
};
export type RoleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleSelect<ExtArgs> | null;
    omit?: Prisma.RoleOmit<ExtArgs> | null;
    include?: Prisma.RoleInclude<ExtArgs> | null;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput | Prisma.RoleOrderByWithRelationInput[];
    cursor?: Prisma.RoleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoleScalarFieldEnum | Prisma.RoleScalarFieldEnum[];
};
export type RoleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleSelect<ExtArgs> | null;
    omit?: Prisma.RoleOmit<ExtArgs> | null;
    include?: Prisma.RoleInclude<ExtArgs> | null;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput | Prisma.RoleOrderByWithRelationInput[];
    cursor?: Prisma.RoleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoleScalarFieldEnum | Prisma.RoleScalarFieldEnum[];
};
export type RoleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleSelect<ExtArgs> | null;
    omit?: Prisma.RoleOmit<ExtArgs> | null;
    include?: Prisma.RoleInclude<ExtArgs> | null;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput | Prisma.RoleOrderByWithRelationInput[];
    cursor?: Prisma.RoleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoleScalarFieldEnum | Prisma.RoleScalarFieldEnum[];
};
export type RoleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleSelect<ExtArgs> | null;
    omit?: Prisma.RoleOmit<ExtArgs> | null;
    include?: Prisma.RoleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoleCreateInput, Prisma.RoleUncheckedCreateInput>;
};
export type RoleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RoleCreateManyInput | Prisma.RoleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RoleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RoleOmit<ExtArgs> | null;
    data: Prisma.RoleCreateManyInput | Prisma.RoleCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RoleIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RoleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleSelect<ExtArgs> | null;
    omit?: Prisma.RoleOmit<ExtArgs> | null;
    include?: Prisma.RoleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoleUpdateInput, Prisma.RoleUncheckedUpdateInput>;
    where: Prisma.RoleWhereUniqueInput;
};
export type RoleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RoleUpdateManyMutationInput, Prisma.RoleUncheckedUpdateManyInput>;
    where?: Prisma.RoleWhereInput;
    limit?: number;
};
export type RoleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RoleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoleUpdateManyMutationInput, Prisma.RoleUncheckedUpdateManyInput>;
    where?: Prisma.RoleWhereInput;
    limit?: number;
    include?: Prisma.RoleIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RoleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleSelect<ExtArgs> | null;
    omit?: Prisma.RoleOmit<ExtArgs> | null;
    include?: Prisma.RoleInclude<ExtArgs> | null;
    where: Prisma.RoleWhereUniqueInput;
    create: Prisma.XOR<Prisma.RoleCreateInput, Prisma.RoleUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RoleUpdateInput, Prisma.RoleUncheckedUpdateInput>;
};
export type RoleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleSelect<ExtArgs> | null;
    omit?: Prisma.RoleOmit<ExtArgs> | null;
    include?: Prisma.RoleInclude<ExtArgs> | null;
    where: Prisma.RoleWhereUniqueInput;
};
export type RoleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoleWhereInput;
    limit?: number;
};
export type Role$organizationMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrganizationMemberSelect<ExtArgs> | null;
    omit?: Prisma.OrganizationMemberOmit<ExtArgs> | null;
    include?: Prisma.OrganizationMemberInclude<ExtArgs> | null;
    where?: Prisma.OrganizationMemberWhereInput;
    orderBy?: Prisma.OrganizationMemberOrderByWithRelationInput | Prisma.OrganizationMemberOrderByWithRelationInput[];
    cursor?: Prisma.OrganizationMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrganizationMemberScalarFieldEnum | Prisma.OrganizationMemberScalarFieldEnum[];
};
export type Role$rolePermissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOmit<ExtArgs> | null;
    include?: Prisma.RolePermissionInclude<ExtArgs> | null;
    where?: Prisma.RolePermissionWhereInput;
    orderBy?: Prisma.RolePermissionOrderByWithRelationInput | Prisma.RolePermissionOrderByWithRelationInput[];
    cursor?: Prisma.RolePermissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RolePermissionScalarFieldEnum | Prisma.RolePermissionScalarFieldEnum[];
};
export type Role$invitationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InvitationSelect<ExtArgs> | null;
    omit?: Prisma.InvitationOmit<ExtArgs> | null;
    include?: Prisma.InvitationInclude<ExtArgs> | null;
    where?: Prisma.InvitationWhereInput;
    orderBy?: Prisma.InvitationOrderByWithRelationInput | Prisma.InvitationOrderByWithRelationInput[];
    cursor?: Prisma.InvitationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InvitationScalarFieldEnum | Prisma.InvitationScalarFieldEnum[];
};
export type RoleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoleSelect<ExtArgs> | null;
    omit?: Prisma.RoleOmit<ExtArgs> | null;
    include?: Prisma.RoleInclude<ExtArgs> | null;
};
