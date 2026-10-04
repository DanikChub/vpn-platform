import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

import sequelize
    from "../../database/sequelize";

import VpnNode
    from "../vpn-nodes/vpn-node.model";


class VpnNodeTrafficPeriod extends Model<
    InferAttributes<VpnNodeTrafficPeriod>,
    InferCreationAttributes<VpnNodeTrafficPeriod>
> {

    declare id:
        CreationOptional<number>;


    declare node_id:
        ForeignKey<VpnNode["id"]>;


    declare started_at:
        Date;


    declare ends_at:
        Date | null;


    /*
     * NULL = лимита нет.
     *
     * BIGINT PostgreSQL через Sequelize
     * читаем строкой.
     */
    declare limit_bytes:
        string | null;


    declare used_bytes:
        CreationOptional<string>;


    declare created_at:
        CreationOptional<Date>;


    declare updated_at:
        CreationOptional<Date>;
}


VpnNodeTrafficPeriod.init(
    {
        id: {
            type:
            DataTypes.INTEGER,

            allowNull:
                false,

            autoIncrement:
                true,

            primaryKey:
                true,
        },


        node_id: {
            type:
            DataTypes.INTEGER,

            allowNull:
                false,
        },


        started_at: {
            type:
            DataTypes.DATE,

            allowNull:
                false,
        },


        ends_at: {
            type:
            DataTypes.DATE,

            allowNull:
                true,
        },


        limit_bytes: {
            type:
            DataTypes.BIGINT,

            allowNull:
                true,
        },


        used_bytes: {
            type:
            DataTypes.BIGINT,

            allowNull:
                false,

            defaultValue:
                "0",
        },


        created_at: {
            type:
            DataTypes.DATE,

            allowNull:
                false,

            defaultValue:
            DataTypes.NOW,
        },


        updated_at: {
            type:
            DataTypes.DATE,

            allowNull:
                false,

            defaultValue:
            DataTypes.NOW,
        },
    },
    {
        sequelize,

        tableName:
            "vpn_node_traffic_periods",

        timestamps:
            false,
    },
);


export default VpnNodeTrafficPeriod;