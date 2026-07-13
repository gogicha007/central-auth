import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type InvitationModel = runtime.Types.Result.DefaultSelection<Prisma.$InvitationPayload>;
export type AggregateInvitation = {
    _count: InvitationCountAggregateOutputType | null;
    _min: InvitationMinAggregateOutputType | null;
    _max: InvitationMaxAggregateOutputType | null;
};
export type InvitationMinAggregateOutputType = {
    id: string | null;
    organizationId: string | null;
    email: string | null;
    roleId: string | null;
    token: string | null;
    expiresAt: Date | null;
    acceptedAt: Date | null;
    createdByUserId: string | null;
};
export type InvitationMaxAggregateOutputType = {
    id: string | null;
    organizationId: string | null;
    email: string | null;
    roleId: string | null;
    token: string | null;
    expiresAt: Date | null;
    acceptedAt: Date | null;
    createdByUserId: string | null;
};
export type InvitationCountAggregateOutputType = {
    id: number;
    organizationId: number;
    email: number;
    roleId: number;
    token: number;
    expiresAt: number;
    acceptedAt: number;
    createdByUserId: number;
    _all: number;
};
export type InvitationMinAggregateInputType = {
    id?: true;
    organizationId?: true;
    email?: true;
    roleId?: true;
    token?: true;
    expiresAt?: true;
    acceptedAt?: true;
    createdByUserId?: true;
};
export type InvitationMaxAggregateInputType = {
    id?: true;
    organizationId?: true;
    email?: true;
    roleId?: true;
    token?: true;
    expiresAt?: true;
    acceptedAt?: true;
    createdByUserId?: true;
};
export type InvitationCountAggregateInputType = {
    id?: true;
    organizationId?: true;
    email?: true;
    roleId?: true;
    token?: true;
    expiresAt?: true;
    acceptedAt?: true;
    createdByUserId?: true;
    _all?: true;
};
export type InvitationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InvitationWhereInput;
    orderBy?: Prisma.InvitationOrderByWithRelationInput | Prisma.InvitationOrderByWithRelationInput[];
    cursor?: Prisma.InvitationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | InvitationCountAggregateInputType;
    _min?: InvitationMinAggregateInputType;
    _max?: InvitationMaxAggregateInputType;
};
export type GetInvitationAggregateType<T extends InvitationAggregateArgs> = {
    [P in keyof T & keyof AggregateInvitation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateInvitation[P]> : Prisma.GetScalarType<T[P], AggregateInvitation[P]>;
};
export type InvitationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InvitationWhereInput;
    orderBy?: Prisma.InvitationOrderByWithAggregationInput | Prisma.InvitationOrderByWithAggregationInput[];
    by: Prisma.InvitationScalarFieldEnum[] | Prisma.InvitationScalarFieldEnum;
    having?: Prisma.InvitationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: InvitationCountAggregateInputType | true;
    _min?: InvitationMinAggregateInputType;
    _max?: InvitationMaxAggregateInputType;
};
export type InvitationGroupByOutputType = {
    id: string;
    organizationId: string;
    email: string;
    roleId: string;
    token: string;
    expiresAt: Date;
    acceptedAt: Date | null;
    createdByUserId: string | null;
    _count: InvitationCountAggregateOutputType | null;
    _min: InvitationMinAggregateOutputType | null;
    _max: InvitationMaxAggregateOutputType | null;
};
export type GetInvitationGroupByPayload<T extends InvitationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<InvitationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof InvitationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], InvitationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], InvitationGroupByOutputType[P]>;
}>>;
export type InvitationWhereInput = {
    AND?: Prisma.InvitationWhereInput | Prisma.InvitationWhereInput[];
    OR?: Prisma.InvitationWhereInput[];
    NOT?: Prisma.InvitationWhereInput | Prisma.InvitationWhereInput[];
    id?: Prisma.StringFilter<"Invitation"> | string;
    organizationId?: Prisma.StringFilter<"Invitation"> | string;
    email?: Prisma.StringFilter<"Invitation"> | string;
    roleId?: Prisma.StringFilter<"Invitation"> | string;
    token?: Prisma.StringFilter<"Invitation"> | string;
    expiresAt?: Prisma.DateTimeFilter<"Invitation"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableFilter<"Invitation"> | Date | string | null;
    createdByUserId?: Prisma.StringNullableFilter<"Invitation"> | string | null;
    organization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
    role?: Prisma.XOR<Prisma.RoleScalarRelationFilter, Prisma.RoleWhereInput>;
    createdByUser?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type InvitationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdByUserId?: Prisma.SortOrderInput | Prisma.SortOrder;
    organization?: Prisma.OrganizationOrderByWithRelationInput;
    role?: Prisma.RoleOrderByWithRelationInput;
    createdByUser?: Prisma.UserOrderByWithRelationInput;
};
export type InvitationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    token?: string;
    AND?: Prisma.InvitationWhereInput | Prisma.InvitationWhereInput[];
    OR?: Prisma.InvitationWhereInput[];
    NOT?: Prisma.InvitationWhereInput | Prisma.InvitationWhereInput[];
    organizationId?: Prisma.StringFilter<"Invitation"> | string;
    email?: Prisma.StringFilter<"Invitation"> | string;
    roleId?: Prisma.StringFilter<"Invitation"> | string;
    expiresAt?: Prisma.DateTimeFilter<"Invitation"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableFilter<"Invitation"> | Date | string | null;
    createdByUserId?: Prisma.StringNullableFilter<"Invitation"> | string | null;
    organization?: Prisma.XOR<Prisma.OrganizationScalarRelationFilter, Prisma.OrganizationWhereInput>;
    role?: Prisma.XOR<Prisma.RoleScalarRelationFilter, Prisma.RoleWhereInput>;
    createdByUser?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id" | "token">;
export type InvitationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdByUserId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.InvitationCountOrderByAggregateInput;
    _max?: Prisma.InvitationMaxOrderByAggregateInput;
    _min?: Prisma.InvitationMinOrderByAggregateInput;
};
export type InvitationScalarWhereWithAggregatesInput = {
    AND?: Prisma.InvitationScalarWhereWithAggregatesInput | Prisma.InvitationScalarWhereWithAggregatesInput[];
    OR?: Prisma.InvitationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.InvitationScalarWhereWithAggregatesInput | Prisma.InvitationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Invitation"> | string;
    organizationId?: Prisma.StringWithAggregatesFilter<"Invitation"> | string;
    email?: Prisma.StringWithAggregatesFilter<"Invitation"> | string;
    roleId?: Prisma.StringWithAggregatesFilter<"Invitation"> | string;
    token?: Prisma.StringWithAggregatesFilter<"Invitation"> | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"Invitation"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Invitation"> | Date | string | null;
    createdByUserId?: Prisma.StringNullableWithAggregatesFilter<"Invitation"> | string | null;
};
export type InvitationCreateInput = {
    id?: string;
    email: string;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    organization: Prisma.OrganizationCreateNestedOneWithoutInvitationsInput;
    role: Prisma.RoleCreateNestedOneWithoutInvitationsInput;
    createdByUser?: Prisma.UserCreateNestedOneWithoutCreatedInvitationsInput;
};
export type InvitationUncheckedCreateInput = {
    id?: string;
    organizationId: string;
    email: string;
    roleId: string;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdByUserId?: string | null;
};
export type InvitationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutInvitationsNestedInput;
    role?: Prisma.RoleUpdateOneRequiredWithoutInvitationsNestedInput;
    createdByUser?: Prisma.UserUpdateOneWithoutCreatedInvitationsNestedInput;
};
export type InvitationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    roleId?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdByUserId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type InvitationCreateManyInput = {
    id?: string;
    organizationId: string;
    email: string;
    roleId: string;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdByUserId?: string | null;
};
export type InvitationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type InvitationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    roleId?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdByUserId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type InvitationListRelationFilter = {
    every?: Prisma.InvitationWhereInput;
    some?: Prisma.InvitationWhereInput;
    none?: Prisma.InvitationWhereInput;
};
export type InvitationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type InvitationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrder;
    createdByUserId?: Prisma.SortOrder;
};
export type InvitationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrder;
    createdByUserId?: Prisma.SortOrder;
};
export type InvitationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    organizationId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    acceptedAt?: Prisma.SortOrder;
    createdByUserId?: Prisma.SortOrder;
};
export type InvitationCreateNestedManyWithoutCreatedByUserInput = {
    create?: Prisma.XOR<Prisma.InvitationCreateWithoutCreatedByUserInput, Prisma.InvitationUncheckedCreateWithoutCreatedByUserInput> | Prisma.InvitationCreateWithoutCreatedByUserInput[] | Prisma.InvitationUncheckedCreateWithoutCreatedByUserInput[];
    connectOrCreate?: Prisma.InvitationCreateOrConnectWithoutCreatedByUserInput | Prisma.InvitationCreateOrConnectWithoutCreatedByUserInput[];
    createMany?: Prisma.InvitationCreateManyCreatedByUserInputEnvelope;
    connect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
};
export type InvitationUncheckedCreateNestedManyWithoutCreatedByUserInput = {
    create?: Prisma.XOR<Prisma.InvitationCreateWithoutCreatedByUserInput, Prisma.InvitationUncheckedCreateWithoutCreatedByUserInput> | Prisma.InvitationCreateWithoutCreatedByUserInput[] | Prisma.InvitationUncheckedCreateWithoutCreatedByUserInput[];
    connectOrCreate?: Prisma.InvitationCreateOrConnectWithoutCreatedByUserInput | Prisma.InvitationCreateOrConnectWithoutCreatedByUserInput[];
    createMany?: Prisma.InvitationCreateManyCreatedByUserInputEnvelope;
    connect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
};
export type InvitationUpdateManyWithoutCreatedByUserNestedInput = {
    create?: Prisma.XOR<Prisma.InvitationCreateWithoutCreatedByUserInput, Prisma.InvitationUncheckedCreateWithoutCreatedByUserInput> | Prisma.InvitationCreateWithoutCreatedByUserInput[] | Prisma.InvitationUncheckedCreateWithoutCreatedByUserInput[];
    connectOrCreate?: Prisma.InvitationCreateOrConnectWithoutCreatedByUserInput | Prisma.InvitationCreateOrConnectWithoutCreatedByUserInput[];
    upsert?: Prisma.InvitationUpsertWithWhereUniqueWithoutCreatedByUserInput | Prisma.InvitationUpsertWithWhereUniqueWithoutCreatedByUserInput[];
    createMany?: Prisma.InvitationCreateManyCreatedByUserInputEnvelope;
    set?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    disconnect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    delete?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    connect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    update?: Prisma.InvitationUpdateWithWhereUniqueWithoutCreatedByUserInput | Prisma.InvitationUpdateWithWhereUniqueWithoutCreatedByUserInput[];
    updateMany?: Prisma.InvitationUpdateManyWithWhereWithoutCreatedByUserInput | Prisma.InvitationUpdateManyWithWhereWithoutCreatedByUserInput[];
    deleteMany?: Prisma.InvitationScalarWhereInput | Prisma.InvitationScalarWhereInput[];
};
export type InvitationUncheckedUpdateManyWithoutCreatedByUserNestedInput = {
    create?: Prisma.XOR<Prisma.InvitationCreateWithoutCreatedByUserInput, Prisma.InvitationUncheckedCreateWithoutCreatedByUserInput> | Prisma.InvitationCreateWithoutCreatedByUserInput[] | Prisma.InvitationUncheckedCreateWithoutCreatedByUserInput[];
    connectOrCreate?: Prisma.InvitationCreateOrConnectWithoutCreatedByUserInput | Prisma.InvitationCreateOrConnectWithoutCreatedByUserInput[];
    upsert?: Prisma.InvitationUpsertWithWhereUniqueWithoutCreatedByUserInput | Prisma.InvitationUpsertWithWhereUniqueWithoutCreatedByUserInput[];
    createMany?: Prisma.InvitationCreateManyCreatedByUserInputEnvelope;
    set?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    disconnect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    delete?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    connect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    update?: Prisma.InvitationUpdateWithWhereUniqueWithoutCreatedByUserInput | Prisma.InvitationUpdateWithWhereUniqueWithoutCreatedByUserInput[];
    updateMany?: Prisma.InvitationUpdateManyWithWhereWithoutCreatedByUserInput | Prisma.InvitationUpdateManyWithWhereWithoutCreatedByUserInput[];
    deleteMany?: Prisma.InvitationScalarWhereInput | Prisma.InvitationScalarWhereInput[];
};
export type InvitationCreateNestedManyWithoutOrganizationInput = {
    create?: Prisma.XOR<Prisma.InvitationCreateWithoutOrganizationInput, Prisma.InvitationUncheckedCreateWithoutOrganizationInput> | Prisma.InvitationCreateWithoutOrganizationInput[] | Prisma.InvitationUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.InvitationCreateOrConnectWithoutOrganizationInput | Prisma.InvitationCreateOrConnectWithoutOrganizationInput[];
    createMany?: Prisma.InvitationCreateManyOrganizationInputEnvelope;
    connect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
};
export type InvitationUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: Prisma.XOR<Prisma.InvitationCreateWithoutOrganizationInput, Prisma.InvitationUncheckedCreateWithoutOrganizationInput> | Prisma.InvitationCreateWithoutOrganizationInput[] | Prisma.InvitationUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.InvitationCreateOrConnectWithoutOrganizationInput | Prisma.InvitationCreateOrConnectWithoutOrganizationInput[];
    createMany?: Prisma.InvitationCreateManyOrganizationInputEnvelope;
    connect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
};
export type InvitationUpdateManyWithoutOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.InvitationCreateWithoutOrganizationInput, Prisma.InvitationUncheckedCreateWithoutOrganizationInput> | Prisma.InvitationCreateWithoutOrganizationInput[] | Prisma.InvitationUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.InvitationCreateOrConnectWithoutOrganizationInput | Prisma.InvitationCreateOrConnectWithoutOrganizationInput[];
    upsert?: Prisma.InvitationUpsertWithWhereUniqueWithoutOrganizationInput | Prisma.InvitationUpsertWithWhereUniqueWithoutOrganizationInput[];
    createMany?: Prisma.InvitationCreateManyOrganizationInputEnvelope;
    set?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    disconnect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    delete?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    connect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    update?: Prisma.InvitationUpdateWithWhereUniqueWithoutOrganizationInput | Prisma.InvitationUpdateWithWhereUniqueWithoutOrganizationInput[];
    updateMany?: Prisma.InvitationUpdateManyWithWhereWithoutOrganizationInput | Prisma.InvitationUpdateManyWithWhereWithoutOrganizationInput[];
    deleteMany?: Prisma.InvitationScalarWhereInput | Prisma.InvitationScalarWhereInput[];
};
export type InvitationUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: Prisma.XOR<Prisma.InvitationCreateWithoutOrganizationInput, Prisma.InvitationUncheckedCreateWithoutOrganizationInput> | Prisma.InvitationCreateWithoutOrganizationInput[] | Prisma.InvitationUncheckedCreateWithoutOrganizationInput[];
    connectOrCreate?: Prisma.InvitationCreateOrConnectWithoutOrganizationInput | Prisma.InvitationCreateOrConnectWithoutOrganizationInput[];
    upsert?: Prisma.InvitationUpsertWithWhereUniqueWithoutOrganizationInput | Prisma.InvitationUpsertWithWhereUniqueWithoutOrganizationInput[];
    createMany?: Prisma.InvitationCreateManyOrganizationInputEnvelope;
    set?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    disconnect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    delete?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    connect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    update?: Prisma.InvitationUpdateWithWhereUniqueWithoutOrganizationInput | Prisma.InvitationUpdateWithWhereUniqueWithoutOrganizationInput[];
    updateMany?: Prisma.InvitationUpdateManyWithWhereWithoutOrganizationInput | Prisma.InvitationUpdateManyWithWhereWithoutOrganizationInput[];
    deleteMany?: Prisma.InvitationScalarWhereInput | Prisma.InvitationScalarWhereInput[];
};
export type InvitationCreateNestedManyWithoutRoleInput = {
    create?: Prisma.XOR<Prisma.InvitationCreateWithoutRoleInput, Prisma.InvitationUncheckedCreateWithoutRoleInput> | Prisma.InvitationCreateWithoutRoleInput[] | Prisma.InvitationUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.InvitationCreateOrConnectWithoutRoleInput | Prisma.InvitationCreateOrConnectWithoutRoleInput[];
    createMany?: Prisma.InvitationCreateManyRoleInputEnvelope;
    connect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
};
export type InvitationUncheckedCreateNestedManyWithoutRoleInput = {
    create?: Prisma.XOR<Prisma.InvitationCreateWithoutRoleInput, Prisma.InvitationUncheckedCreateWithoutRoleInput> | Prisma.InvitationCreateWithoutRoleInput[] | Prisma.InvitationUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.InvitationCreateOrConnectWithoutRoleInput | Prisma.InvitationCreateOrConnectWithoutRoleInput[];
    createMany?: Prisma.InvitationCreateManyRoleInputEnvelope;
    connect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
};
export type InvitationUpdateManyWithoutRoleNestedInput = {
    create?: Prisma.XOR<Prisma.InvitationCreateWithoutRoleInput, Prisma.InvitationUncheckedCreateWithoutRoleInput> | Prisma.InvitationCreateWithoutRoleInput[] | Prisma.InvitationUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.InvitationCreateOrConnectWithoutRoleInput | Prisma.InvitationCreateOrConnectWithoutRoleInput[];
    upsert?: Prisma.InvitationUpsertWithWhereUniqueWithoutRoleInput | Prisma.InvitationUpsertWithWhereUniqueWithoutRoleInput[];
    createMany?: Prisma.InvitationCreateManyRoleInputEnvelope;
    set?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    disconnect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    delete?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    connect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    update?: Prisma.InvitationUpdateWithWhereUniqueWithoutRoleInput | Prisma.InvitationUpdateWithWhereUniqueWithoutRoleInput[];
    updateMany?: Prisma.InvitationUpdateManyWithWhereWithoutRoleInput | Prisma.InvitationUpdateManyWithWhereWithoutRoleInput[];
    deleteMany?: Prisma.InvitationScalarWhereInput | Prisma.InvitationScalarWhereInput[];
};
export type InvitationUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: Prisma.XOR<Prisma.InvitationCreateWithoutRoleInput, Prisma.InvitationUncheckedCreateWithoutRoleInput> | Prisma.InvitationCreateWithoutRoleInput[] | Prisma.InvitationUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.InvitationCreateOrConnectWithoutRoleInput | Prisma.InvitationCreateOrConnectWithoutRoleInput[];
    upsert?: Prisma.InvitationUpsertWithWhereUniqueWithoutRoleInput | Prisma.InvitationUpsertWithWhereUniqueWithoutRoleInput[];
    createMany?: Prisma.InvitationCreateManyRoleInputEnvelope;
    set?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    disconnect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    delete?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    connect?: Prisma.InvitationWhereUniqueInput | Prisma.InvitationWhereUniqueInput[];
    update?: Prisma.InvitationUpdateWithWhereUniqueWithoutRoleInput | Prisma.InvitationUpdateWithWhereUniqueWithoutRoleInput[];
    updateMany?: Prisma.InvitationUpdateManyWithWhereWithoutRoleInput | Prisma.InvitationUpdateManyWithWhereWithoutRoleInput[];
    deleteMany?: Prisma.InvitationScalarWhereInput | Prisma.InvitationScalarWhereInput[];
};
export type InvitationCreateWithoutCreatedByUserInput = {
    id?: string;
    email: string;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    organization: Prisma.OrganizationCreateNestedOneWithoutInvitationsInput;
    role: Prisma.RoleCreateNestedOneWithoutInvitationsInput;
};
export type InvitationUncheckedCreateWithoutCreatedByUserInput = {
    id?: string;
    organizationId: string;
    email: string;
    roleId: string;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
};
export type InvitationCreateOrConnectWithoutCreatedByUserInput = {
    where: Prisma.InvitationWhereUniqueInput;
    create: Prisma.XOR<Prisma.InvitationCreateWithoutCreatedByUserInput, Prisma.InvitationUncheckedCreateWithoutCreatedByUserInput>;
};
export type InvitationCreateManyCreatedByUserInputEnvelope = {
    data: Prisma.InvitationCreateManyCreatedByUserInput | Prisma.InvitationCreateManyCreatedByUserInput[];
    skipDuplicates?: boolean;
};
export type InvitationUpsertWithWhereUniqueWithoutCreatedByUserInput = {
    where: Prisma.InvitationWhereUniqueInput;
    update: Prisma.XOR<Prisma.InvitationUpdateWithoutCreatedByUserInput, Prisma.InvitationUncheckedUpdateWithoutCreatedByUserInput>;
    create: Prisma.XOR<Prisma.InvitationCreateWithoutCreatedByUserInput, Prisma.InvitationUncheckedCreateWithoutCreatedByUserInput>;
};
export type InvitationUpdateWithWhereUniqueWithoutCreatedByUserInput = {
    where: Prisma.InvitationWhereUniqueInput;
    data: Prisma.XOR<Prisma.InvitationUpdateWithoutCreatedByUserInput, Prisma.InvitationUncheckedUpdateWithoutCreatedByUserInput>;
};
export type InvitationUpdateManyWithWhereWithoutCreatedByUserInput = {
    where: Prisma.InvitationScalarWhereInput;
    data: Prisma.XOR<Prisma.InvitationUpdateManyMutationInput, Prisma.InvitationUncheckedUpdateManyWithoutCreatedByUserInput>;
};
export type InvitationScalarWhereInput = {
    AND?: Prisma.InvitationScalarWhereInput | Prisma.InvitationScalarWhereInput[];
    OR?: Prisma.InvitationScalarWhereInput[];
    NOT?: Prisma.InvitationScalarWhereInput | Prisma.InvitationScalarWhereInput[];
    id?: Prisma.StringFilter<"Invitation"> | string;
    organizationId?: Prisma.StringFilter<"Invitation"> | string;
    email?: Prisma.StringFilter<"Invitation"> | string;
    roleId?: Prisma.StringFilter<"Invitation"> | string;
    token?: Prisma.StringFilter<"Invitation"> | string;
    expiresAt?: Prisma.DateTimeFilter<"Invitation"> | Date | string;
    acceptedAt?: Prisma.DateTimeNullableFilter<"Invitation"> | Date | string | null;
    createdByUserId?: Prisma.StringNullableFilter<"Invitation"> | string | null;
};
export type InvitationCreateWithoutOrganizationInput = {
    id?: string;
    email: string;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    role: Prisma.RoleCreateNestedOneWithoutInvitationsInput;
    createdByUser?: Prisma.UserCreateNestedOneWithoutCreatedInvitationsInput;
};
export type InvitationUncheckedCreateWithoutOrganizationInput = {
    id?: string;
    email: string;
    roleId: string;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdByUserId?: string | null;
};
export type InvitationCreateOrConnectWithoutOrganizationInput = {
    where: Prisma.InvitationWhereUniqueInput;
    create: Prisma.XOR<Prisma.InvitationCreateWithoutOrganizationInput, Prisma.InvitationUncheckedCreateWithoutOrganizationInput>;
};
export type InvitationCreateManyOrganizationInputEnvelope = {
    data: Prisma.InvitationCreateManyOrganizationInput | Prisma.InvitationCreateManyOrganizationInput[];
    skipDuplicates?: boolean;
};
export type InvitationUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: Prisma.InvitationWhereUniqueInput;
    update: Prisma.XOR<Prisma.InvitationUpdateWithoutOrganizationInput, Prisma.InvitationUncheckedUpdateWithoutOrganizationInput>;
    create: Prisma.XOR<Prisma.InvitationCreateWithoutOrganizationInput, Prisma.InvitationUncheckedCreateWithoutOrganizationInput>;
};
export type InvitationUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: Prisma.InvitationWhereUniqueInput;
    data: Prisma.XOR<Prisma.InvitationUpdateWithoutOrganizationInput, Prisma.InvitationUncheckedUpdateWithoutOrganizationInput>;
};
export type InvitationUpdateManyWithWhereWithoutOrganizationInput = {
    where: Prisma.InvitationScalarWhereInput;
    data: Prisma.XOR<Prisma.InvitationUpdateManyMutationInput, Prisma.InvitationUncheckedUpdateManyWithoutOrganizationInput>;
};
export type InvitationCreateWithoutRoleInput = {
    id?: string;
    email: string;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    organization: Prisma.OrganizationCreateNestedOneWithoutInvitationsInput;
    createdByUser?: Prisma.UserCreateNestedOneWithoutCreatedInvitationsInput;
};
export type InvitationUncheckedCreateWithoutRoleInput = {
    id?: string;
    organizationId: string;
    email: string;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdByUserId?: string | null;
};
export type InvitationCreateOrConnectWithoutRoleInput = {
    where: Prisma.InvitationWhereUniqueInput;
    create: Prisma.XOR<Prisma.InvitationCreateWithoutRoleInput, Prisma.InvitationUncheckedCreateWithoutRoleInput>;
};
export type InvitationCreateManyRoleInputEnvelope = {
    data: Prisma.InvitationCreateManyRoleInput | Prisma.InvitationCreateManyRoleInput[];
    skipDuplicates?: boolean;
};
export type InvitationUpsertWithWhereUniqueWithoutRoleInput = {
    where: Prisma.InvitationWhereUniqueInput;
    update: Prisma.XOR<Prisma.InvitationUpdateWithoutRoleInput, Prisma.InvitationUncheckedUpdateWithoutRoleInput>;
    create: Prisma.XOR<Prisma.InvitationCreateWithoutRoleInput, Prisma.InvitationUncheckedCreateWithoutRoleInput>;
};
export type InvitationUpdateWithWhereUniqueWithoutRoleInput = {
    where: Prisma.InvitationWhereUniqueInput;
    data: Prisma.XOR<Prisma.InvitationUpdateWithoutRoleInput, Prisma.InvitationUncheckedUpdateWithoutRoleInput>;
};
export type InvitationUpdateManyWithWhereWithoutRoleInput = {
    where: Prisma.InvitationScalarWhereInput;
    data: Prisma.XOR<Prisma.InvitationUpdateManyMutationInput, Prisma.InvitationUncheckedUpdateManyWithoutRoleInput>;
};
export type InvitationCreateManyCreatedByUserInput = {
    id?: string;
    organizationId: string;
    email: string;
    roleId: string;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
};
export type InvitationUpdateWithoutCreatedByUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutInvitationsNestedInput;
    role?: Prisma.RoleUpdateOneRequiredWithoutInvitationsNestedInput;
};
export type InvitationUncheckedUpdateWithoutCreatedByUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    roleId?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type InvitationUncheckedUpdateManyWithoutCreatedByUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    roleId?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type InvitationCreateManyOrganizationInput = {
    id?: string;
    email: string;
    roleId: string;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdByUserId?: string | null;
};
export type InvitationUpdateWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    role?: Prisma.RoleUpdateOneRequiredWithoutInvitationsNestedInput;
    createdByUser?: Prisma.UserUpdateOneWithoutCreatedInvitationsNestedInput;
};
export type InvitationUncheckedUpdateWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    roleId?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdByUserId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type InvitationUncheckedUpdateManyWithoutOrganizationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    roleId?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdByUserId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type InvitationCreateManyRoleInput = {
    id?: string;
    organizationId: string;
    email: string;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdByUserId?: string | null;
};
export type InvitationUpdateWithoutRoleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    organization?: Prisma.OrganizationUpdateOneRequiredWithoutInvitationsNestedInput;
    createdByUser?: Prisma.UserUpdateOneWithoutCreatedInvitationsNestedInput;
};
export type InvitationUncheckedUpdateWithoutRoleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdByUserId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type InvitationUncheckedUpdateManyWithoutRoleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    organizationId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdByUserId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type InvitationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    email?: boolean;
    roleId?: boolean;
    token?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    createdByUserId?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
    createdByUser?: boolean | Prisma.Invitation$createdByUserArgs<ExtArgs>;
}, ExtArgs["result"]["invitation"]>;
export type InvitationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    email?: boolean;
    roleId?: boolean;
    token?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    createdByUserId?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
    createdByUser?: boolean | Prisma.Invitation$createdByUserArgs<ExtArgs>;
}, ExtArgs["result"]["invitation"]>;
export type InvitationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    organizationId?: boolean;
    email?: boolean;
    roleId?: boolean;
    token?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    createdByUserId?: boolean;
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
    createdByUser?: boolean | Prisma.Invitation$createdByUserArgs<ExtArgs>;
}, ExtArgs["result"]["invitation"]>;
export type InvitationSelectScalar = {
    id?: boolean;
    organizationId?: boolean;
    email?: boolean;
    roleId?: boolean;
    token?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    createdByUserId?: boolean;
};
export type InvitationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "organizationId" | "email" | "roleId" | "token" | "expiresAt" | "acceptedAt" | "createdByUserId", ExtArgs["result"]["invitation"]>;
export type InvitationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
    createdByUser?: boolean | Prisma.Invitation$createdByUserArgs<ExtArgs>;
};
export type InvitationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
    createdByUser?: boolean | Prisma.Invitation$createdByUserArgs<ExtArgs>;
};
export type InvitationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    organization?: boolean | Prisma.OrganizationDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
    createdByUser?: boolean | Prisma.Invitation$createdByUserArgs<ExtArgs>;
};
export type $InvitationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Invitation";
    objects: {
        organization: Prisma.$OrganizationPayload<ExtArgs>;
        role: Prisma.$RolePayload<ExtArgs>;
        createdByUser: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        organizationId: string;
        email: string;
        roleId: string;
        token: string;
        expiresAt: Date;
        acceptedAt: Date | null;
        createdByUserId: string | null;
    }, ExtArgs["result"]["invitation"]>;
    composites: {};
};
export type InvitationGetPayload<S extends boolean | null | undefined | InvitationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$InvitationPayload, S>;
export type InvitationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<InvitationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: InvitationCountAggregateInputType | true;
};
export interface InvitationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Invitation'];
        meta: {
            name: 'Invitation';
        };
    };
    findUnique<T extends InvitationFindUniqueArgs>(args: Prisma.SelectSubset<T, InvitationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__InvitationClient<runtime.Types.Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends InvitationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, InvitationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__InvitationClient<runtime.Types.Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends InvitationFindFirstArgs>(args?: Prisma.SelectSubset<T, InvitationFindFirstArgs<ExtArgs>>): Prisma.Prisma__InvitationClient<runtime.Types.Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends InvitationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, InvitationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__InvitationClient<runtime.Types.Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends InvitationFindManyArgs>(args?: Prisma.SelectSubset<T, InvitationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends InvitationCreateArgs>(args: Prisma.SelectSubset<T, InvitationCreateArgs<ExtArgs>>): Prisma.Prisma__InvitationClient<runtime.Types.Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends InvitationCreateManyArgs>(args?: Prisma.SelectSubset<T, InvitationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends InvitationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, InvitationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends InvitationDeleteArgs>(args: Prisma.SelectSubset<T, InvitationDeleteArgs<ExtArgs>>): Prisma.Prisma__InvitationClient<runtime.Types.Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends InvitationUpdateArgs>(args: Prisma.SelectSubset<T, InvitationUpdateArgs<ExtArgs>>): Prisma.Prisma__InvitationClient<runtime.Types.Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends InvitationDeleteManyArgs>(args?: Prisma.SelectSubset<T, InvitationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends InvitationUpdateManyArgs>(args: Prisma.SelectSubset<T, InvitationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends InvitationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, InvitationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends InvitationUpsertArgs>(args: Prisma.SelectSubset<T, InvitationUpsertArgs<ExtArgs>>): Prisma.Prisma__InvitationClient<runtime.Types.Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends InvitationCountArgs>(args?: Prisma.Subset<T, InvitationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], InvitationCountAggregateOutputType> : number>;
    aggregate<T extends InvitationAggregateArgs>(args: Prisma.Subset<T, InvitationAggregateArgs>): Prisma.PrismaPromise<GetInvitationAggregateType<T>>;
    groupBy<T extends InvitationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: InvitationGroupByArgs['orderBy'];
    } : {
        orderBy?: InvitationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, InvitationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvitationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: InvitationFieldRefs;
}
export interface Prisma__InvitationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    organization<T extends Prisma.OrganizationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrganizationDefaultArgs<ExtArgs>>): Prisma.Prisma__OrganizationClient<runtime.Types.Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    role<T extends Prisma.RoleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RoleDefaultArgs<ExtArgs>>): Prisma.Prisma__RoleClient<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    createdByUser<T extends Prisma.Invitation$createdByUserArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Invitation$createdByUserArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface InvitationFieldRefs {
    readonly id: Prisma.FieldRef<"Invitation", 'String'>;
    readonly organizationId: Prisma.FieldRef<"Invitation", 'String'>;
    readonly email: Prisma.FieldRef<"Invitation", 'String'>;
    readonly roleId: Prisma.FieldRef<"Invitation", 'String'>;
    readonly token: Prisma.FieldRef<"Invitation", 'String'>;
    readonly expiresAt: Prisma.FieldRef<"Invitation", 'DateTime'>;
    readonly acceptedAt: Prisma.FieldRef<"Invitation", 'DateTime'>;
    readonly createdByUserId: Prisma.FieldRef<"Invitation", 'String'>;
}
export type InvitationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InvitationSelect<ExtArgs> | null;
    omit?: Prisma.InvitationOmit<ExtArgs> | null;
    include?: Prisma.InvitationInclude<ExtArgs> | null;
    where: Prisma.InvitationWhereUniqueInput;
};
export type InvitationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InvitationSelect<ExtArgs> | null;
    omit?: Prisma.InvitationOmit<ExtArgs> | null;
    include?: Prisma.InvitationInclude<ExtArgs> | null;
    where: Prisma.InvitationWhereUniqueInput;
};
export type InvitationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type InvitationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type InvitationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type InvitationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InvitationSelect<ExtArgs> | null;
    omit?: Prisma.InvitationOmit<ExtArgs> | null;
    include?: Prisma.InvitationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InvitationCreateInput, Prisma.InvitationUncheckedCreateInput>;
};
export type InvitationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.InvitationCreateManyInput | Prisma.InvitationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type InvitationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InvitationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.InvitationOmit<ExtArgs> | null;
    data: Prisma.InvitationCreateManyInput | Prisma.InvitationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.InvitationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type InvitationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InvitationSelect<ExtArgs> | null;
    omit?: Prisma.InvitationOmit<ExtArgs> | null;
    include?: Prisma.InvitationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InvitationUpdateInput, Prisma.InvitationUncheckedUpdateInput>;
    where: Prisma.InvitationWhereUniqueInput;
};
export type InvitationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.InvitationUpdateManyMutationInput, Prisma.InvitationUncheckedUpdateManyInput>;
    where?: Prisma.InvitationWhereInput;
    limit?: number;
};
export type InvitationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InvitationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.InvitationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InvitationUpdateManyMutationInput, Prisma.InvitationUncheckedUpdateManyInput>;
    where?: Prisma.InvitationWhereInput;
    limit?: number;
    include?: Prisma.InvitationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type InvitationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InvitationSelect<ExtArgs> | null;
    omit?: Prisma.InvitationOmit<ExtArgs> | null;
    include?: Prisma.InvitationInclude<ExtArgs> | null;
    where: Prisma.InvitationWhereUniqueInput;
    create: Prisma.XOR<Prisma.InvitationCreateInput, Prisma.InvitationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.InvitationUpdateInput, Prisma.InvitationUncheckedUpdateInput>;
};
export type InvitationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InvitationSelect<ExtArgs> | null;
    omit?: Prisma.InvitationOmit<ExtArgs> | null;
    include?: Prisma.InvitationInclude<ExtArgs> | null;
    where: Prisma.InvitationWhereUniqueInput;
};
export type InvitationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InvitationWhereInput;
    limit?: number;
};
export type Invitation$createdByUserArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type InvitationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InvitationSelect<ExtArgs> | null;
    omit?: Prisma.InvitationOmit<ExtArgs> | null;
    include?: Prisma.InvitationInclude<ExtArgs> | null;
};
