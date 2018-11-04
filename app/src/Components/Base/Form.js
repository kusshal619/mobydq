import React from 'react';
import { Query, Mutation } from 'react-apollo';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

export const BaseForm = ({ title, FormComponent, ComponentRepository, afterSaveRoute, history, initialFieldValues }) => <Query query={ComponentRepository.getFormDropdownData()}>
  {({ loading, error, data }) => {
    const queryLoading = loading;
    const queryError = error;
    const queryData = data;
    if (typeof ComponentRepository.insert === 'undefined' || typeof ComponentRepository.getFormDropdownData === 'undefined') {
      throw new TypeError('Repository must implement insert and getFormDropdownData functions.');
    }
    const mutation = initialFieldValues === null ? ComponentRepository.insert() : ComponentRepository.update();
    const recordId = initialFieldValues === null ? null : initialFieldValues.id;
    if (queryLoading) {
      return <p>Loading...</p>;
    }
    if (queryError) {
      return <p>Error :(</p>;
    }
    return (
      <Mutation
        mutation={mutation}
        onCompleted={() => {
          history.push(afterSaveRoute);
        }}
      >
        {(mutate, { loading, error }) => <React.Fragment>
          <div style={{ 'float': 'right', 'visibility': initialFieldValues === null ? 'hidden' : 'visible' }}>
            {
              _deleteMutation(
                ComponentRepository,
                recordId,
                () => {
                  history.push(afterSaveRoute);
                }
              )
            }
          </div>
          <div style={{ 'marginLeft': '60px' }}>{title}</div>
          <FormComponent
            data={queryData}
            mutate={mutate}
            initialFieldValues={initialFieldValues}
          />
          {loading && <p>Loading...</p>}
          {error && <p>Error .. Please try again</p>}

        </React.Fragment>}
      </Mutation>
    );
  }}
</Query>;

function _deleteMutation(ComponentRepository, idToDelete, afterSave) {
  return (
    <Mutation
      mutation={ComponentRepository.delete()}
      variables={{ 'id': idToDelete }}
      onCompleted={afterSave}
    >
      { (deleteFunc, { loading, error }) => {
        const deleteMutationLoading = loading;
        const deleteMutationError = error;
        if (deleteMutationLoading) {
          return <p>Loading...</p>;
        }
        if (deleteMutationError) {
          return <p>Error...</p>;
        }
        return (
          <Button onClick={() => {deleteFunc();}} variant="contained">
            <DeleteIcon/> Delete
          </Button>
        );
      }}
    </Mutation>
  );
}
