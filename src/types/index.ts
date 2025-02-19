// MODAL PROPS TYPE
export interface ModalPropType {
    id?: number | string
    open: boolean,
    update?: any,
    handleCancel: ()=> void,
    
}