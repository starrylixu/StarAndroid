根据传入的参数，获取级联表的id
```sql
<insert id="saveMedicalNode" parameterType="io.renren.modules.hospital.entity.EmrJdInfoEntity">
    INSERT INTO EMR_JD_INFO (EMR_bl_id,
                             EMR_info_jd,
                             EMR_jd_page,
                             EMR_jd_type_id)
    VALUES (#{emrBlId},
            if(#{emrJdTypeId} = 0, IFNULL(#{modelEntity.emrXyId}, 1), IFNULL(#{zyModelEntity.emrZyId}, 1)),
            #{emrJdPage},
            #{emrJdTypeId});
</insert>
```
